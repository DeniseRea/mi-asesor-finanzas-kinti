import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';
import * as nodemailer from 'nodemailer';

jest.mock('nodemailer');

describe('EmailService', () => {
  let service: EmailService;
  let sendMailMock: jest.Mock;

  beforeEach(async () => {
    sendMailMock = jest.fn();
    (nodemailer.createTransport as jest.Mock).mockReturnValue({
      sendMail: sendMailMock,
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailService],
    }).compile();

    service = module.get<EmailService>(EmailService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('sendVerificationCode', () => {
    it('should log the code if SMTP is not configured', async () => {
      delete process.env.SMTP_EMAIL; // ensure it's not set
      
      // Re-initialize service without env vars
      const module: TestingModule = await Test.createTestingModule({
        providers: [EmailService],
      }).compile();
      const noSmtpService = module.get<EmailService>(EmailService);
      
      const loggerSpy = jest.spyOn(require('@nestjs/common').Logger.prototype, 'warn').mockImplementation();
      
      await noSmtpService.sendVerificationCode('test@test.com', '123456');
      
      expect(sendMailMock).not.toHaveBeenCalled();
      expect(loggerSpy).toHaveBeenCalledWith(expect.stringContaining('Código de verificación para test@test.com: 123456'));
      
      loggerSpy.mockRestore();
    });

    it('should send email if SMTP is configured', async () => {
      process.env.SMTP_EMAIL = 'user@test.com';
      process.env.SMTP_PASSWORD = 'pass';
      
      // Re-initialize service with env vars
      const module: TestingModule = await Test.createTestingModule({
        providers: [EmailService],
      }).compile();
      const smtpService = module.get<EmailService>(EmailService);
      
      await smtpService.sendVerificationCode('test@test.com', '123456');
      
      expect(sendMailMock).toHaveBeenCalledWith(expect.objectContaining({
        to: 'test@test.com',
        subject: 'Verifica tu cuenta de Kinti',
      }));
    });
  });
});
