/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
import { JwtService } from '@nestjs/jwt';
import { validate } from 'class-validator';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';

jest.mock('firebase-admin/app', () => ({
  cert: jest.fn(),
  initializeApp: jest.fn(),
}));
jest.mock('firebase-admin/auth', () => ({ getAuth: jest.fn() }));

describe('AuthService registration verification', () => {
  const prisma = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
    },
    passwordReset: {
      findFirst: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
    },
    $transaction: jest.fn(),
  };
  const email = {
    sendVerificationCode: jest.fn(),
    sendPasswordResetCode: jest.fn(),
  };
  const jwt = new JwtService({ secret: 'test-registration-secret' });
  const service = new AuthService(prisma as never, jwt, email as never);

  beforeEach(() => {
    jest.clearAllMocks();
    prisma.user.findUnique.mockResolvedValue(null);
    prisma.user.create.mockResolvedValue({ id: 'user-1' });
    prisma.passwordReset.findFirst.mockResolvedValue(null);
    prisma.passwordReset.create.mockResolvedValue({ id: 'reset-1' });
    prisma.passwordReset.update.mockResolvedValue({ id: 'reset-1' });
    prisma.user.update.mockResolvedValue({ id: 'user-1' });
    prisma.$transaction.mockResolvedValue([]);
    email.sendPasswordResetCode.mockResolvedValue(undefined);
  });

  it('no crea el usuario hasta validar el código correcto', async () => {
    const pending = await service.register({
      name: 'Ana Prueba',
      email: 'ana@example.com',
      password: 'Clave123€',
      confirmPassword: 'Clave123€',
    });
    expect(prisma.user.create).not.toHaveBeenCalled();
    const code = email.sendVerificationCode.mock.calls[0][1] as string;

    await service.verifyEmail(
      'ana@example.com',
      code,
      pending.verificationToken,
    );

    expect(prisma.user.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          email: 'ana@example.com',
          emailVerified: true,
        }),
      }),
    );
  });

  it('acepta el símbolo euro en una contraseña válida', async () => {
    const dto = Object.assign(new RegisterDto(), {
      name: 'Ana Prueba',
      email: 'ana@example.com',
      password: 'Clave123€',
      confirmPassword: 'Clave123€',
    });
    await expect(validate(dto)).resolves.toHaveLength(0);
  });

  it('envía y guarda un código de recuperación de contraseña', async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: 'user-1',
      email: 'ana@example.com',
      password: 'password-hash',
    });

    await service.requestPasswordReset(' ANA@example.com ');

    expect(email.sendPasswordResetCode).toHaveBeenCalledWith(
      'ana@example.com',
      expect.stringMatching(/^\d{6}$/),
    );
    expect(prisma.passwordReset.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        userId: 'user-1',
        codeHash: expect.any(String),
        expiresAt: expect.any(Date),
      }),
    });
    expect(prisma.passwordReset.updateMany).toHaveBeenCalledWith({
      where: {
        userId: 'user-1',
        id: { not: 'reset-1' },
        usedAt: null,
      },
      data: { usedAt: expect.any(Date) },
    });
  });

  it('elimina el código nuevo si Brevo no puede enviar el correo', async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: 'user-1',
      email: 'ana@example.com',
      password: 'password-hash',
    });
    email.sendPasswordResetCode.mockRejectedValue(
      new Error('Brevo no disponible'),
    );

    await expect(
      service.requestPasswordReset('ana@example.com'),
    ).rejects.toThrow('Brevo no disponible');
    expect(prisma.passwordReset.delete).toHaveBeenCalledWith({
      where: { id: 'reset-1' },
    });
    expect(prisma.passwordReset.updateMany).not.toHaveBeenCalled();
  });

  it('verifica el código y permite establecer una contraseña nueva', async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: 'user-1',
      email: 'ana@example.com',
      password: 'password-hash',
    });
    await service.requestPasswordReset('ana@example.com');
    const code = email.sendPasswordResetCode.mock.calls[0][1] as string;
    const createdReset = prisma.passwordReset.create.mock.calls[0][0] as {
      data: { codeHash: string };
    };
    prisma.passwordReset.findFirst.mockResolvedValue({
      id: 'reset-1',
      codeHash: createdReset.data.codeHash,
      expiresAt: new Date(Date.now() + 60_000),
      attempts: 0,
    });

    const { resetToken } = await service.verifyPasswordReset(
      'ana@example.com',
      code,
    );
    expect(resetToken).toMatch(/^[a-f0-9]{64}$/);

    await service.resetPassword({
      email: 'ana@example.com',
      resetToken,
      password: 'NuevaClave123€',
      confirmPassword: 'NuevaClave123€',
    });

    expect(prisma.$transaction).toHaveBeenCalledTimes(1);
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: 'user-1' },
      data: { password: expect.any(String) },
    });
    expect(prisma.passwordReset.update).toHaveBeenLastCalledWith({
      where: { id: 'reset-1' },
      data: { usedAt: expect.any(Date) },
    });
  });
});
