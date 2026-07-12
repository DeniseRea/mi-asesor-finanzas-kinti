import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { KintiWebhookDto } from './dto/kinti-webhook.dto';

@Injectable()
export class KintiService {
  private readonly logger = new Logger(KintiService.name);
  
  // Memoria temporal para MVP (Reemplazar con Redis, WebSockets o BD en el futuro)
  private readonly buzonRespuestas = new Map<string, string>();

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Envía un mensaje (y opcionalmente un archivo) a n8n de forma asíncrona.
   * Retorna inmediatamente tras confirmar recepción (200 OK).
   */
  async sendMessageToAI(usuario_id: string, mensaje?: string, file?: Express.Multer.File): Promise<void> {
    const webhookUrl = this.configService.get<string>('N8N_WEBHOOK_URL') || 'http://localhost:5678/webhook/procesar-gasto';

    try {
      let response: Response;

      if (file) {
        // Modo: Archivo + Texto (multipart/form-data)
        const formData = new FormData();
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
        this.logger.log(`Enviando mensaje de texto a n8n para el usuario ${usuario_id}`);
        response = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ usuario_id, mensaje }),
        });
      }

      if (!response.ok) {
        this.logger.error(`n8n respondió con error: ${response.status} ${response.statusText}`);
        throw new HttpException('Fallo al contactar al motor de IA', HttpStatus.BAD_GATEWAY);
      }

      // Consumimos el buffer pero no bloqueamos a que la IA procese la data
      await response.json().catch(() => null); 
      this.logger.log(`n8n recibió el payload exitosamente (Status: ${response.status})`);

    } catch (error: any) {
      this.logger.error(`Error en sendMessageToAI: ${error.message}`);
      throw new HttpException('Error de comunicación con IA', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Procesa el callback asíncrono desde n8n
   */
  async procesarCallbackN8n(dto: KintiWebhookDto): Promise<void> {
    this.logger.log(`Recibido callback de n8n para usuario ${dto.usuario_id}. Acción: ${dto.accion}`);

    try {
      // 1. Inserción masiva en BD dentro de una transacción de Prisma
      if (dto.movimientos && dto.movimientos.length > 0) {
        await this.prisma.$transaction(async (tx) => {
          const insertData = dto.movimientos.map((mov) => ({
            userId: dto.usuario_id,
            amount: mov.monto,
            type: mov.tipo,
            category: mov.categoria,
            entity: mov.entidad || null,
            date: new Date(mov.fecha),
            description: `Vía IA: ${dto.origen}`,
            confirmed: true, // Asumimos que viene limpio
          }));

          await tx.transaction.createMany({ data: insertData });
        });
        
        this.logger.log(`Se insertaron ${dto.movimientos.length} movimientos en la base de datos.`);
      }

      // 2. Emitir respuesta al cliente
      this.emitirRespuestaAlCliente(dto.usuario_id, dto.respuesta_chat);

    } catch (error: any) {
      this.logger.error(`Error guardando movimientos: ${error.message}`);
      throw new HttpException('Error al guardar datos de n8n', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Emite la respuesta. En este ejemplo lo dejamos en un buzón en memoria 
   * que el frontend puede consultar vía Long Polling. 
   * En un escenario ideal, esto emitiría un evento WebSocket (Socket.io) o SSE.
   */
  private emitirRespuestaAlCliente(userId: string, respuestaChat: string) {
    this.logger.log(`Emitiendo respuesta de chat para el usuario ${userId}`);
    this.buzonRespuestas.set(userId, respuestaChat);
  }

  // Método auxiliar para el frontend (Polling)
  obtenerRespuestaPendiente(userId: string): string | null {
    if (this.buzonRespuestas.has(userId)) {
      const resp = this.buzonRespuestas.get(userId);
      this.buzonRespuestas.delete(userId); // Limpiamos tras leer
      return resp || null;
    }
    return null;
  }
}
