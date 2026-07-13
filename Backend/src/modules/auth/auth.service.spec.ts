import { JwtService } from '@nestjs/jwt';
import { validate } from 'class-validator';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';

jest.mock('firebase-admin/app', () => ({ cert: jest.fn(), initializeApp: jest.fn() }));
jest.mock('firebase-admin/auth', () => ({ getAuth: jest.fn() }));

describe('AuthService registration verification', () => {
  const prisma = {
    user: { findUnique: jest.fn(), create: jest.fn(), delete: jest.fn() },
  };
  const email = { sendVerificationCode: jest.fn() };
  const jwt = new JwtService({ secret: 'test-registration-secret' });
  const service = new AuthService(prisma as never, jwt, email as never);

  beforeEach(() => {
    jest.clearAllMocks();
    prisma.user.findUnique.mockResolvedValue(null);
    prisma.user.create.mockResolvedValue({ id: 'user-1' });
  });

  it('no crea el usuario hasta validar el código correcto', async () => {
    const pending = await service.register({ name: 'Ana Prueba', email: 'ana@example.com', password: 'Clave123€', confirmPassword: 'Clave123€' });
    expect(prisma.user.create).not.toHaveBeenCalled();
    const code = email.sendVerificationCode.mock.calls[0][1] as string;

    await service.verifyEmail('ana@example.com', code, pending.verificationToken);

    expect(prisma.user.create).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ email: 'ana@example.com', emailVerified: true }) }));
  });

  it('acepta el símbolo euro en una contraseña válida', async () => {
    const dto = Object.assign(new RegisterDto(), { name: 'Ana Prueba', email: 'ana@example.com', password: 'Clave123€', confirmPassword: 'Clave123€' });
    await expect(validate(dto)).resolves.toHaveLength(0);
  });
});
