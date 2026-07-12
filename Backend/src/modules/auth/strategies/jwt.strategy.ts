import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'kinti-hackathon-2026-secret-key',
    });
  }

  async validate(payload: { sub: string; email: string; jti?: string; exp?: number }) {
    if (payload.jti) {
      const revoked = await this.prisma.revokedToken.findUnique({
        where: { tokenJti: payload.jti },
      });
      if (revoked) {
        throw new UnauthorizedException('Token revocado');
      }
    }

    return { id: payload.sub, email: payload.email, jti: payload.jti, tokenExp: payload.exp };
  }
}
