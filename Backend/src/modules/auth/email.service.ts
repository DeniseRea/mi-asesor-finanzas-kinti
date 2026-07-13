import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { BrevoClient } from '@getbrevo/brevo';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly brevo: BrevoClient | null;
  private readonly fromEmail: string;
  private readonly fromName: string;

  constructor() {
    const apiKey = process.env.BREVO_API_KEY?.trim();
    const fromEmail = process.env.BREVO_FROM_EMAIL?.trim();
    const fromName = process.env.BREVO_FROM_NAME?.trim() || 'Kinti';

    this.fromEmail = fromEmail || '';
    this.fromName = fromName;

    if (!apiKey || !fromEmail) {
      this.brevo = null;
      this.logger.warn(
        'Brevo no está configurado: define BREVO_API_KEY y BREVO_FROM_EMAIL',
      );
      return;
    }

    this.brevo = new BrevoClient({
      apiKey,
      timeoutInSeconds: 15,
      maxRetries: 1,
    });
  }

  async sendVerificationCode(email: string, code: string): Promise<void> {
    await this.sendEmail(
      email,
      'Verifica tu cuenta de Kinti',
      `
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
      'verificación',
    );
  }

  async sendPasswordResetCode(email: string, code: string): Promise<void> {
    await this.sendEmail(
      email,
      'Recupera tu contraseña de Kinti',
      `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
          <h2 style="color: #075b40;">Recupera tu contraseña</h2>
          <p style="color: #334155; font-size: 15px;">Usa este código de un solo uso:</p>
          <div style="text-align: center; margin: 32px 0;">
            <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #075b40; background: #f0fdf4; padding: 16px 32px; border-radius: 12px; display: inline-block;">
              ${code}
            </span>
          </div>
          <p style="color: #64748b; font-size: 13px;">
            Este código expira en 15 minutos. Si no solicitaste el cambio, ignora este mensaje.
          </p>
        </div>
      `,
      'recuperación de contraseña',
    );
  }

  private async sendEmail(
    to: string,
    subject: string,
    html: string,
    emailType: string,
  ): Promise<void> {
    if (!this.brevo || !this.fromEmail) {
      throw new ServiceUnavailableException('Brevo no está configurado');
    }

    try {
      const result = await this.brevo.transactionalEmails.sendTransacEmail({
        sender: {
          email: this.fromEmail,
          name: this.fromName,
        },
        to: [{ email: to }],
        subject,
        htmlContent: html,
      });

      this.logger.log(
        `Email de ${emailType} enviado a ${to} (Brevo ID: ${result.messageId})`,
      );
    } catch (error: unknown) {
      const detail =
        error instanceof Error ? error.message : 'Error desconocido de Brevo';
      this.logger.error(
        `Error al enviar email de ${emailType} a ${to}: ${detail}`,
      );
      throw new ServiceUnavailableException(
        `No se pudo enviar el correo de ${emailType}`,
      );
    }
  }
}
