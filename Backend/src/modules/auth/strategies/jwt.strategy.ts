import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly prisma: PrismaService;

  constructor(prisma: PrismaService, configService: ConfigService) {
    const secret = configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET es obligatoria');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
    this.prisma = prisma;
  }

  async validate(payload: {
    sub: string;
    email: string;
    jti?: string;
    exp?: number;
  }) {
    if (payload.jti) {
      const revoked = await this.prisma.revokedToken.findUnique({
        where: { tokenJti: payload.jti },
      });
      if (revoked) {
        throw new UnauthorizedException('Token revocado');
      }
    }

    return {
      id: payload.sub,
      email: payload.email,
      jti: payload.jti,
      tokenExp: payload.exp,
    };
  }
}
