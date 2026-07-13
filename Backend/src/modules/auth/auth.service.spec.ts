import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from './email.service';
import mockPrismaService from '../../prisma/__mocks__/prisma.service';
import { ConflictException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

jest.mock('bcrypt');
jest.mock('crypto', () => ({
  ...jest.requireActual('crypto'),
  randomInt: jest.fn(),
  randomUUID: jest.fn(),
}));

jest.mock('firebase-admin/app', () => ({
  initializeApp: jest.fn().mockReturnValue({}),
  cert: jest.fn(),
}));

jest.mock('firebase-admin/auth', () => ({
  getAuth: jest.fn().mockReturnValue({
    verifyIdToken: jest.fn(),
  }),
}));

import { getAuth } from 'firebase-admin/auth';
import { createUser } from '../../test-utils/factories';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: typeof mockPrismaService;
  let jwtService: jest.Mocked<JwtService>;
  let emailService: jest.Mocked<EmailService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: { sign: jest.fn() } },
        { provide: EmailService, useValue: { sendVerificationCode: jest.fn() } },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get(PrismaService) as typeof mockPrismaService;
    jwtService = module.get(JwtService) as any;
    emailService = module.get(EmailService) as any;

    (crypto.randomInt as jest.Mock).mockReturnValue(123456);
    (crypto.randomUUID as jest.Mock).mockReturnValue('mocked-uuid');
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    const dto = { name: 'Test', email: 'test@test.com', password: 'password', confirmPassword: 'password' };

    it('should register successfully', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue(createUser({ id: '1', ...dto }));

      const result = await service.register(dto);

      expect(result.user).toEqual({ id: '1', name: 'Test', email: 'test@test.com' });
      expect(prisma.user.create).toHaveBeenCalled();
      expect(emailService.sendVerificationCode).toHaveBeenCalledWith('test@test.com', '123456');
    });

    it('should throw ConflictException if email exists', async () => {
      prisma.user.findUnique.mockResolvedValue(createUser());
      await expect(service.register(dto)).rejects.toThrow(ConflictException);
    });

    it('should throw ConflictException if passwords mismatch', async () => {
      await expect(service.register({ ...dto, confirmPassword: 'wrong' })).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    const dto = { email: 'test@test.com', password: 'password' };

    it('should login successfully', async () => {
      prisma.user.findUnique.mockResolvedValue(createUser({ password: 'hashed-password', emailVerified: true }));
      jwtService.sign.mockReturnValue('jwt-token');

      const result = await service.login(dto);

      expect(result.token).toBe('jwt-token');
      expect(result.user.email).toBe('test@test.com');
    });

    it('should throw UnauthorizedException if user not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password incorrect', async () => {
      prisma.user.findUnique.mockResolvedValue(createUser({ password: 'hashed-password', emailVerified: true }));
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if email not verified', async () => {
      prisma.user.findUnique.mockResolvedValue(createUser({ password: 'hashed-password', emailVerified: false }));
      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if google account (no password)', async () => {
      prisma.user.findUnique.mockResolvedValue(createUser({ password: null }));
      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('loginWithFirebase', () => {
    it('should create new user and return token if new Google user', async () => {
      service['firebaseApp'] = {} as any; // mock initialized app
      const getAuthMock = getAuth as jest.Mock;
      getAuthMock().verifyIdToken.mockResolvedValue({ email: 'google@test.com', name: 'Google User' });
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue(createUser({ email: 'google@test.com', emailVerified: true }));
      jwtService.sign.mockReturnValue('jwt-token');

      const result = await service.loginWithFirebase('fake-token');

      expect(prisma.user.create).toHaveBeenCalled();
      expect(result.token).toBe('jwt-token');
    });

    it('should return token if user already exists', async () => {
      service['firebaseApp'] = {} as any;
      const getAuthMock = getAuth as jest.Mock;
      getAuthMock().verifyIdToken.mockResolvedValue({ email: 'google@test.com' });
      prisma.user.findUnique.mockResolvedValue(createUser({ email: 'google@test.com', emailVerified: true }));
      jwtService.sign.mockReturnValue('jwt-token');

      const result = await service.loginWithFirebase('fake-token');

      expect(prisma.user.create).not.toHaveBeenCalled();
      expect(result.token).toBe('jwt-token');
    });

    it('should throw UnauthorizedException if firebase token invalid', async () => {
      service['firebaseApp'] = {} as any;
      const getAuthMock = getAuth as jest.Mock;
      getAuthMock().verifyIdToken.mockRejectedValue(new Error('Invalid token'));

      await expect(service.loginWithFirebase('bad-token')).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('verifyEmail', () => {
    it('should verify email successfully', async () => {
      const expires = new Date(Date.now() + 10000);
      prisma.user.findUnique.mockResolvedValue(createUser({ emailVerified: false, verificationCode: '123456', verificationExpires: expires }));
      
      const result = await service.verifyEmail('test@test.com', '123456');
      
      expect(result.message).toBe('Email verificado correctamente');
      expect(prisma.user.update).toHaveBeenCalled();
    });

    it('should return already verified message', async () => {
      prisma.user.findUnique.mockResolvedValue(createUser({ emailVerified: true }));
      const result = await service.verifyEmail('test@test.com', '123456');
      expect(result.message).toBe('El email ya está verificado');
    });

    it('should throw BadRequestException if code expired', async () => {
      const expires = new Date(Date.now() - 10000);
      prisma.user.findUnique.mockResolvedValue(createUser({ emailVerified: false, verificationCode: '123456', verificationExpires: expires }));
      await expect(service.verifyEmail('test@test.com', '123456')).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if code incorrect', async () => {
      const expires = new Date(Date.now() + 10000);
      prisma.user.findUnique.mockResolvedValue(createUser({ emailVerified: false, verificationCode: '123456', verificationExpires: expires }));
      await expect(service.verifyEmail('test@test.com', 'wrong')).rejects.toThrow(BadRequestException);
    });
  });

  describe('resendVerificationCode', () => {
    it('should resend successfully', async () => {
      const expires = new Date(Date.now() - 61 * 1000); // More than 60s ago
      prisma.user.findUnique.mockResolvedValue(createUser({ emailVerified: false, verificationExpires: expires }));
      
      const result = await service.resendVerificationCode('test@test.com');
      
      expect(result.message).toBe('Código de verificación reenviado');
      expect(emailService.sendVerificationCode).toHaveBeenCalled();
    });

    it('should throw BadRequestException if in cooldown', async () => {
      const expires = new Date(Date.now() + 14.5 * 60 * 1000); // Requested 30 seconds ago
      prisma.user.findUnique.mockResolvedValue(createUser({ emailVerified: false, verificationExpires: expires }));
      
      await expect(service.resendVerificationCode('test@test.com')).rejects.toThrow(BadRequestException);
    });
  });

  describe('logout', () => {
    it('should create revoked token and cleanup', async () => {
      const result = await service.logout('user-1', 'jti-1', 10000);
      expect(prisma.revokedToken.create).toHaveBeenCalledWith({ data: expect.objectContaining({ tokenJti: 'jti-1' }) });
      expect(prisma.revokedToken.deleteMany).toHaveBeenCalled();
      expect(result.message).toBe('Sesión cerrada correctamente');
    });
  });

  describe('getProfile', () => {
    it('should return profile', async () => {
      prisma.user.findUnique.mockResolvedValue(createUser({ id: '1', name: 'Test' }));
      const result = await service.getProfile('1');
      expect(result.id).toBe('1');
      expect(result.name).toBe('Test');
    });

    it('should throw if not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      await expect(service.getProfile('1')).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('updateProfile', () => {
    it('should update profile', async () => {
      prisma.user.update.mockResolvedValue(createUser({ id: '1', currency: 'EUR' }));
      const result = await service.updateProfile('1', { currency: 'EUR' });
      expect(result.currency).toBe('EUR');
    });
  });
});
