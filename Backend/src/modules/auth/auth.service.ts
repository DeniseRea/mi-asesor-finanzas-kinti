import { Injectable, ConflictException, UnauthorizedException, BadRequestException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { EmailService } from './email.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { cert, initializeApp, type App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private firebaseApp: App | null = null;

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {
    this.initFirebase();
  }

  private initFirebase() {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (projectId && clientEmail && privateKey) {
      this.firebaseApp = initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey: privateKey.replace(/\\n/g, '\n'),
        }),
      });
    }
  }

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) {
      throw new ConflictException('El email ya está registrado');
    }

    if (dto.password !== dto.confirmPassword) {
      throw new ConflictException('Las contraseñas no coinciden');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const code = this.generateVerificationCode();
    const expires = new Date(Date.now() + 15 * 60 * 1000);

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
        verificationCode: code,
        verificationExpires: expires,
      },
    });

    await this.emailService.sendVerificationCode(user.email, code);

    return { user: { id: user.id, name: user.name, email: user.email } };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (!user.password) {
      throw new UnauthorizedException('Esta cuenta fue creada con Google. Inicia sesión con Google.');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (!user.emailVerified) {
      throw new UnauthorizedException('Email no verificado. Revisa tu bandeja de entrada.');
    }

    const token = this.generateToken(user);
    return { user: { id: user.id, name: user.name, email: user.email }, token };
  }

  async loginWithFirebase(idToken: string) {
    if (!this.firebaseApp) {
      throw new UnauthorizedException('Firebase no está configurado');
    }

    let decoded: { email?: string; name?: string };
    try {
      decoded = await getAuth(this.firebaseApp).verifyIdToken(idToken);
    } catch {
      throw new UnauthorizedException('Token de Firebase inválido');
    }

    const email = decoded.email;
    const name = decoded.name || email?.split('@')[0] || 'Usuario Google';

    if (!email) {
      throw new UnauthorizedException('No se pudo obtener el email de Google');
    }

    let user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          name,
          email,
          password: null,
          emailVerified: true,
        },
      });
    } else if (!user.emailVerified) {
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: true },
      });
    }

    const token = this.generateToken(user);
    return { user: { id: user.id, name: user.name, email: user.email }, token };
  }

  async verifyEmail(email: string, code: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }

    if (user.emailVerified) {
      return { message: 'El email ya está verificado' };
    }

    if (!user.verificationCode || !user.verificationExpires) {
      throw new BadRequestException('No hay código de verificación pendiente');
    }

    if (user.verificationExpires < new Date()) {
      throw new BadRequestException('El código ha expirado. Solicita uno nuevo.');
    }

    if (user.verificationCode !== code) {
      throw new BadRequestException('Código de verificación inválido');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verificationCode: null,
        verificationExpires: null,
      },
    });

    return { message: 'Email verificado correctamente' };
  }

  async resendVerificationCode(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }

    if (user.emailVerified) {
      return { message: 'El email ya está verificado' };
    }

    if (user.verificationExpires) {
      const codeCreatedAt = new Date(user.verificationExpires.getTime() - 15 * 60 * 1000);
      const cooldownEnd = new Date(codeCreatedAt.getTime() + 60 * 1000);
      if (new Date() < cooldownEnd) {
        throw new BadRequestException('Espera 60 segundos antes de solicitar un nuevo código');
      }
    }

    const code = this.generateVerificationCode();
    const expires = new Date(Date.now() + 15 * 60 * 1000);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        verificationCode: code,
        verificationExpires: expires,
      },
    });

    await this.emailService.sendVerificationCode(user.email, code);

    return { message: 'Código de verificación reenviado' };
  }

  async logout(userId: string, jti: string, tokenExp: number) {
    await this.prisma.revokedToken.create({
      data: {
        tokenJti: jti,
        expiresAt: new Date(tokenExp * 1000),
      },
    });

    await this.cleanupExpiredTokens();

    return { message: 'Sesión cerrada correctamente' };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }
    return { id: user.id, name: user.name, email: user.email, phone: user.phone, currency: user.currency, emailVerified: user.emailVerified };
  }

  async updateProfile(userId: string, data: { phone?: string; currency?: string }) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data,
    });
    return { id: user.id, name: user.name, email: user.email, phone: user.phone, currency: user.currency };
  }

  private generateToken(user: { id: string; email: string }) {
    const jti = crypto.randomUUID();
    const payload = { sub: user.id, email: user.email, jti };
    return this.jwtService.sign(payload);
  }

  private generateVerificationCode(): string {
    return crypto.randomInt(100000, 999999).toString();
  }

  private async cleanupExpiredTokens() {
    await this.prisma.revokedToken.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });
  }
}
