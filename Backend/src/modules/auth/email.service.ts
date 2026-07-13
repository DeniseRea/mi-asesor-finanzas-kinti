import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter | null = null;
  private readonly from: string;

  constructor() {
    const user = process.env.SMTP_EMAIL;
    const pass = process.env.SMTP_PASSWORD;
    const service = process.env.SMTP_SERVICE;
    if (!user || !pass || !service) {
      throw new Error(
        'SMTP_EMAIL, SMTP_PASSWORD y SMTP_SERVICE son obligatorias',
      );
    }

    this.from = process.env.SMTP_FROM?.trim() || `"Kinti" <${user}>`;

    this.transporter = nodemailer.createTransport({
      service,
      auth: { user, pass },
    });
  }

  async sendVerificationCode(email: string, code: string): Promise<void> {
    if (!this.transporter) {
      throw new ServiceUnavailableException('SMTP no está configurado');
    }

    try {
      await this.transporter.sendMail({
        from: this.from,
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
    } catch (error) {
      this.logger.error(`Error al enviar email a ${email}: ${error.message}`);
      throw new ServiceUnavailableException(
        'No se pudo enviar el correo de verificación',
      );
    }
  }

  async sendPasswordResetCode(email: string, code: string): Promise<void> {
    if (!this.transporter) {
      throw new ServiceUnavailableException('SMTP no está configurado');
    }
    await this.transporter.sendMail({
      from: this.from,
      to: email,
      subject: 'Recupera tu contraseña de Kinti',
      html: `<div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;padding:32px"><h2 style="color:#075b40">Recupera tu contraseña</h2><p>Usa este código de un solo uso:</p><p style="font-size:36px;font-weight:bold;letter-spacing:8px">${code}</p><p>Expira en 15 minutos. Si no solicitaste el cambio, ignora este mensaje.</p></div>`,
    });
  }
}
