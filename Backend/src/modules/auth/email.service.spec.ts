/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ServiceUnavailableException } from '@nestjs/common';
import { EmailService } from './email.service';

const mockSend = jest.fn();

jest.mock('@getbrevo/brevo', () => ({
  BrevoClient: jest.fn().mockImplementation(() => ({
    transactionalEmails: { sendTransacEmail: mockSend },
  })),
}));

describe('EmailService con Brevo', () => {
  const previousApiKey = process.env.BREVO_API_KEY;
  const previousFromEmail = process.env.BREVO_FROM_EMAIL;
  const previousFromName = process.env.BREVO_FROM_NAME;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.BREVO_API_KEY = 'xkeysib-test';
    process.env.BREVO_FROM_EMAIL = 'kinti@example.com';
    process.env.BREVO_FROM_NAME = 'Kinti';
    mockSend.mockResolvedValue({ messageId: 'email-1' });
  });

  afterAll(() => {
    if (previousApiKey === undefined) delete process.env.BREVO_API_KEY;
    else process.env.BREVO_API_KEY = previousApiKey;

    if (previousFromEmail === undefined) delete process.env.BREVO_FROM_EMAIL;
    else process.env.BREVO_FROM_EMAIL = previousFromEmail;

    if (previousFromName === undefined) delete process.env.BREVO_FROM_NAME;
    else process.env.BREVO_FROM_NAME = previousFromName;
  });

  it('envía el código de verificación con HTML y texto plano', async () => {
    const service = new EmailService();

    await service.sendVerificationCode('ana@example.com', '123456');

    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        sender: { email: 'kinti@example.com', name: 'Kinti' },
        to: [{ email: 'ana@example.com' }],
        subject: 'Verifica tu cuenta de Kinti',
        htmlContent: expect.stringContaining('123456'),
      }),
    );
  });

  it('envía el código de recuperación de contraseña', async () => {
    const service = new EmailService();

    await service.sendPasswordResetCode('ana@example.com', '654321');

    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        to: [{ email: 'ana@example.com' }],
        subject: 'Recupera tu contraseña de Kinti',
        htmlContent: expect.stringContaining('654321'),
      }),
    );
  });

  it('convierte los errores de la API en un 503', async () => {
    mockSend.mockRejectedValue(new Error('Remitente no verificado'));
    const service = new EmailService();

    await expect(
      service.sendVerificationCode('ana@example.com', '123456'),
    ).rejects.toBeInstanceOf(ServiceUnavailableException);
  });

  it('devuelve 503 al enviar si falta la configuración de Brevo', async () => {
    delete process.env.BREVO_API_KEY;
    const service = new EmailService();

    await expect(
      service.sendVerificationCode('ana@example.com', '123456'),
    ).rejects.toThrow(
      new ServiceUnavailableException('Brevo no está configurado'),
    );
  });
});
