import {
  Injectable,
  Logger,
  HttpException,
  HttpStatus,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { KintiWebhookDto } from './dto/kinti-webhook.dto';
import { AlertsService } from '../alerts/alerts.service';

@Injectable()
export class KintiService {
  private readonly logger = new Logger(KintiService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly alertsService: AlertsService,
  ) {}

  /**
   * Envía un mensaje (y opcionalmente un archivo) a n8n de forma asíncrona.
   * Retorna inmediatamente tras confirmar recepción (200 OK).
   */
  async sendMessageToAI(
    usuario_id: string,
    mensaje?: string,
    file?: Express.Multer.File,
  ) {
    const webhookUrl = this.configService.get<string>('N8N_WEBHOOK_URL');
    if (!webhookUrl)
      throw new ServiceUnavailableException('N8N_WEBHOOK_URL no está configurada');
    const request = await this.prisma.aiRequest.create({
      data: {
        userId: usuario_id,
        message: mensaje,
        fileName: file?.originalname,
      },
    });

    try {
      let response: Response;

      if (file) {
        // Modo: Archivo + Texto (multipart/form-data)
        const formData = new FormData();
        formData.append('request_id', request.id);
        formData.append('usuario_id', usuario_id);
        if (mensaje) formData.append('mensaje', mensaje);

        const blob = new Blob([file.buffer as any], { type: file.mimetype });
        formData.append('data', blob, file.originalname);

        this.logger.log(`Enviando archivo a n8n para el usuario ${usuario_id}`);
        response = await fetch(webhookUrl, {
          method: 'POST',
          body: formData,
        });
      } else {
        // Modo: Solo Texto (application/json)
        this.logger.log(
          `Enviando mensaje de texto a n8n para el usuario ${usuario_id}`,
        );
        response = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ request_id: request.id, usuario_id, mensaje }),
        });
      }

      if (!response.ok) {
        this.logger.error(
          `n8n respondió con error: ${response.status} ${response.statusText}`,
        );
        throw new HttpException(
          'Fallo al contactar al motor de IA',
          HttpStatus.BAD_GATEWAY,
        );
      }

      // Consumimos el buffer pero no bloqueamos a que la IA procese la data
      await response.json().catch(() => null);
      this.logger.log(
        `La IA recibió el payload exitosamente (Status: ${response.status})`,
      );
      return { requestId: request.id, status: request.status };
    } catch (error: any) {
      await this.prisma.aiRequest
        .update({
          where: { id: request.id },
          data: {
            status: 'failed',
            errorMessage: error.message,
            completedAt: new Date(),
          },
        })
        .catch(() => undefined);
      this.logger.error(`Error en sendMessageToAI: ${error.message}`);
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Error de comunicación con IA',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  /**
   * Procesa el callback asíncrono desde n8n
   */
  async procesarCallbackN8n(dto: KintiWebhookDto): Promise<void> {
    this.logger.log(
      `Recibido callback de n8n para usuario ${dto.usuario_id}. Acción: ${dto.accion}`,
    );

    try {
        const request = dto.request_id
          ? await this.prisma.aiRequest.findUnique({ where: { id: dto.request_id } })
          : await this.prisma.aiRequest.findFirst({ where: { userId: dto.usuario_id, status: 'processing' }, orderBy: { createdAt: 'desc' } });
      if (!request || request.userId !== dto.usuario_id)
        throw new NotFoundException('Solicitud de IA no encontrada');
        if (request.status === 'completed') return;
        const processed = await this.prisma.$transaction(async (tx) => {
          const claim = await tx.aiRequest.updateMany({
            where: { id: request.id, userId: dto.usuario_id, status: 'processing' },
            data: { status: 'completing' },
          });
          if (claim.count === 0) return false;
        if (dto.movimientos && dto.movimientos.length > 0) {
          const insertData = dto.movimientos.map((mov) => ({
            userId: dto.usuario_id,
            amount: mov.monto,
            type: mov.tipo,
            category: mov.categoria,
            entity: mov.entidad || null,
            date: new Date(mov.fecha),
            description: `Vía IA: ${dto.origen}`,
            confirmed: true, // Asumimos que viene limpio
            aiRequestId: request.id,
          }));

          await tx.transaction.createMany({ data: insertData });
        }
          await tx.aiRequest.update({
          where: { id: request.id },
          data: {
            status: 'completed',
            responseText: dto.respuesta_chat,
            completedAt: new Date(),
          },
          });
          return true;
        });
        if (!processed) return;
      this.logger.log(
        `Se insertaron ${dto.movimientos.length} movimientos en la base de datos.`,
      );
      for (const movement of dto.movimientos.filter(
        (item) => item.tipo === 'GASTO',
      ))
        await this.alertsService.onTransactionCreated({
          userId: dto.usuario_id,
          category: movement.categoria,
          amount: movement.monto,
          date: new Date(movement.fecha),
        });
    } catch (error: any) {
      this.logger.error(`Error guardando movimientos: ${error.message}`);
      throw new HttpException(
        'Error al guardar datos de n8n',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async obtenerRespuesta(userId: string, requestId: string) {
    if (!requestId) throw new NotFoundException('requestId es requerido');
    const request = await this.prisma.aiRequest.findUnique({
      where: { id: requestId },
    });
    if (!request || request.userId !== userId)
      throw new NotFoundException('Solicitud de IA no encontrada');
    return {
      requestId: request.id,
      status: request.status,
      respuesta: request.responseText,
      error: request.errorMessage,
    };
  }

  async historial(userId: string) {
    return this.prisma.aiRequest.findMany({
      where: { userId },
      select: {
        id: true,
        message: true,
        status: true,
        responseText: true,
        createdAt: true,
        completedAt: true,
      },
      orderBy: { createdAt: 'asc' },
      take: 100,
    });
  }
}
