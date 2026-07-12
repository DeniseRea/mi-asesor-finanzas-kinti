import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    const user = process.env.SMTP_EMAIL;
    const pass = process.env.SMTP_PASSWORD;

    if (user && pass) {
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user, pass },
      });
    } else {
      this.logger.warn('SMTP_EMAIL/SMTP_PASSWORD no configurados. Los emails no se enviarán.');
    }
  }

  async sendVerificationCode(email: string, code: string): Promise<void> {
    if (!this.transporter) {
      this.logger.warn(`[DEV] Código de verificación para ${email}: ${code}`);
      return;
    }

    await this.transporter.sendMail({
      from: '"Kinti" <kinti.app@gmail.com>',
      to: email,
      subject: 'Verifica tu cuenta de Kinti',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
          <h2 style="color: #075b40;">Verifica tu cuenta</h2>
          <p style="color: #334155; font-size: 15px;">
            Ingresa el siguiente código de 6 dígitos para completar tu registro:
          </p>
          <div style="text-align: center; margin: 32px 0;">
            <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #075b40; background: #f0fdf4; padding: 16px 32px; border-radius: 12px; display: inline-block;">
              ${code}
            </span>
          </div>
          <p style="color: #64748b; font-size: 13px;">
            Este código expira en 15 minutos. Si no creaste esta cuenta, puedes ignorar este mensaje.
          </p>
        </div>
      `,
    });

    this.logger.log(`Email de verificación enviado a ${email}`);
  }
}
