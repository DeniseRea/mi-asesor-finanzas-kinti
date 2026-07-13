import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { EmailService } from './email.service';
import { ResetPasswordDto } from './dto/password-reset.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { cert, initializeApp, type App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

interface PendingRegistration {
  purpose: 'email-verification';
  name: string;
  email: string;
  passwordHash: string;
  codeHash: string;
  iat?: number;
  exp?: number;
}

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
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
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
    const email = dto.email.trim().toLowerCase();
    const name = dto.name.trim().replace(/\s+/g, ' ');
    const existing = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existing) {
      if (existing.emailVerified) {
        throw new ConflictException('El email ya está registrado');
      }
      // Limpia registros incompletos creados por la versión anterior del flujo.
      await this.prisma.user.delete({ where: { id: existing.id } });
    }

    if (dto.password !== dto.confirmPassword) {
      throw new ConflictException('Las contraseñas no coinciden');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const code = this.generateVerificationCode();
    const verificationToken = this.createRegistrationToken({
      purpose: 'email-verification',
      name,
      email,
      passwordHash,
      codeHash: this.hashSecret(code),
    });
    await this.emailService.sendVerificationCode(email, code);
    return { verificationToken, expiresIn: 900 };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (!user.password) {
      throw new UnauthorizedException(
        'Esta cuenta fue creada con Google. Inicia sesión con Google.',
      );
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (!user.emailVerified) {
      throw new UnauthorizedException(
        'Email no verificado. Revisa tu bandeja de entrada.',
      );
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

  async verifyEmail(email: string, code: string, verificationToken: string) {
    const pending = this.decodeRegistrationToken(verificationToken);
    const normalizedEmail = email.trim().toLowerCase();
    if (
      pending.email !== normalizedEmail ||
      pending.codeHash !== this.hashSecret(code)
    ) {
      throw new BadRequestException('Código de verificación inválido');
    }
    const existing = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });
    if (existing) throw new ConflictException('El email ya está registrado');
    await this.prisma.user.create({
      data: {
        name: pending.name,
        email: pending.email,
        password: pending.passwordHash,
        emailVerified: true,
      },
    });
    return { message: 'Email verificado correctamente' };
  }

  async resendVerificationCode(email: string, verificationToken: string) {
    const pending = this.decodeRegistrationToken(verificationToken);
    const normalizedEmail = email.trim().toLowerCase();
    if (pending.email !== normalizedEmail)
      throw new BadRequestException('Solicitud de verificación inválida');
    if (pending.iat && Date.now() / 1000 - pending.iat < 60) {
      throw new BadRequestException(
        'Espera 60 segundos antes de solicitar un nuevo código',
      );
    }
    const code = this.generateVerificationCode();
    const nextToken = this.createRegistrationToken({
      purpose: 'email-verification',
      name: pending.name,
      email: pending.email,
      passwordHash: pending.passwordHash,
      codeHash: this.hashSecret(code),
    });
    await this.emailService.sendVerificationCode(pending.email, code);
    return {
      message: 'Código de verificación reenviado',
      verificationToken: nextToken,
    };
  }

  async logout(userId: string, jti: string, tokenExp: number) {
    if (!jti || !tokenExp) return { message: 'Sesión cerrada correctamente' };
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
    return this.toProfile(user);
  }

  async updateProfile(userId: string, data: UpdateProfileDto) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data,
    });
    return this.toProfile(user);
  }

  async requestPasswordReset(email: string) {
    const normalized = email.trim().toLowerCase();
    const user = await this.prisma.user.findUnique({
      where: { email: normalized },
    });
    if (user?.password) {
      const latest = await this.prisma.passwordReset.findFirst({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
      });
      if (latest && latest.createdAt.getTime() > Date.now() - 60_000) {
        return {
          message: 'Si la cuenta existe, enviaremos un código de recuperación.',
        };
      }

      const code = this.generateVerificationCode();
      const reset = await this.prisma.passwordReset.create({
        data: {
          userId: user.id,
          codeHash: this.hashSecret(code),
          expiresAt: new Date(Date.now() + 15 * 60 * 1000),
        },
      });

      try {
        await this.emailService.sendPasswordResetCode(user.email, code);
      } catch (error) {
        try {
          await this.prisma.passwordReset.delete({ where: { id: reset.id } });
        } catch (cleanupError) {
          this.logger.error(
            `No se pudo limpiar la solicitud de recuperación ${reset.id}`,
            cleanupError,
          );
        }
        throw error;
      }

      await this.prisma.passwordReset.updateMany({
        where: { userId: user.id, id: { not: reset.id }, usedAt: null },
        data: { usedAt: new Date() },
      });
    }
    return {
      message: 'Si la cuenta existe, enviaremos un código de recuperación.',
    };
  }

  async verifyPasswordReset(email: string, code: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });
    if (!user) throw new BadRequestException('Código inválido o expirado');
    const reset = await this.prisma.passwordReset.findFirst({
      where: { userId: user.id, usedAt: null },
      orderBy: { createdAt: 'desc' },
    });
    if (!reset || reset.expiresAt < new Date() || reset.attempts >= 5)
      throw new BadRequestException('Código inválido o expirado');
    if (reset.codeHash !== this.hashSecret(code)) {
      await this.prisma.passwordReset.update({
        where: { id: reset.id },
        data: { attempts: { increment: 1 } },
      });
      throw new BadRequestException('Código inválido o expirado');
    }
    const token = crypto.randomBytes(32).toString('hex');
    await this.prisma.passwordReset.update({
      where: { id: reset.id },
      data: {
        codeHash: this.hashSecret(token),
        verifiedAt: new Date(),
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
    });
    return { resetToken: token };
  }

  async resetPassword(dto: ResetPasswordDto) {
    if (dto.password !== dto.confirmPassword)
      throw new BadRequestException('Las contraseñas no coinciden');
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.trim().toLowerCase() },
    });
    if (!user) throw new BadRequestException('Solicitud inválida o expirada');
    const reset = await this.prisma.passwordReset.findFirst({
      where: {
        userId: user.id,
        codeHash: this.hashSecret(dto.resetToken),
        verifiedAt: { not: null },
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });
    if (!reset) throw new BadRequestException('Solicitud inválida o expirada');
    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: user.id },
        data: { password: await bcrypt.hash(dto.password, 10) },
      }),
      this.prisma.passwordReset.update({
        where: { id: reset.id },
        data: { usedAt: new Date() },
      }),
    ]);
    return { message: 'Contraseña actualizada correctamente' };
  }

  async exportAccount(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        currency: true,
        createdAt: true,
        transactions: true,
        budgets: true,
        alerts: true,
        tickets: { include: { messages: true } },
        aiRequests: true,
      },
    });
  }

  async deleteAccount(userId: string) {
    await this.prisma.user.delete({ where: { id: userId } });
    return { deleted: true };
  }

  private createRegistrationToken(payload: PendingRegistration) {
    return this.jwtService.sign(payload, { expiresIn: '15m' });
  }

  private decodeRegistrationToken(token: string): PendingRegistration {
    try {
      const payload = this.jwtService.verify<PendingRegistration>(token);
      if (payload.purpose !== 'email-verification')
        throw new Error('invalid purpose');
      return payload;
    } catch {
      throw new BadRequestException(
        'La verificación expiró. Inicia el registro nuevamente.',
      );
    }
  }

  private hashSecret(value: string) {
    return crypto.createHash('sha256').update(value).digest('hex');
  }

  private toProfile(user: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    currency: string;
    emailVerified: boolean;
    darkMode: boolean;
    budgetAlerts: boolean;
    movementAlerts: boolean;
    insightAlerts: boolean;
  }) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      currency: user.currency,
      emailVerified: user.emailVerified,
      darkMode: user.darkMode,
      budgetAlerts: user.budgetAlerts,
      movementAlerts: user.movementAlerts,
      insightAlerts: user.insightAlerts,
    };
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
