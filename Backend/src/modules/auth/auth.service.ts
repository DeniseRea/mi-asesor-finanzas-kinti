import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { cert, initializeApp, type App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

@Injectable()
export class AuthService {
  private firebaseApp: App | null = null;

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
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

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
      },
    });

    const token = this.generateToken(user);
    return { user: { id: user.id, name: user.name, email: user.email }, token };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password!);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
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
        },
      });
    }

    const token = this.generateToken(user);
    return { user: { id: user.id, name: user.name, email: user.email }, token };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }
    return { id: user.id, name: user.name, email: user.email, phone: user.phone, currency: user.currency };
  }

  async updateProfile(userId: string, data: { phone?: string; currency?: string }) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data,
    });
    return { id: user.id, name: user.name, email: user.email, phone: user.phone, currency: user.currency };
  }

  private generateToken(user: { id: string; email: string }) {
    const payload = { sub: user.id, email: user.email };
    return this.jwtService.sign(payload);
  }
}
