import {
  Controller,
  Post,
  Get,
  Body,
  UploadedFile,
  UseInterceptors,
  HttpCode,
  HttpStatus,
  Req,
  UseGuards,
  UnauthorizedException,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { KintiService } from './kinti.service';
import { KintiWebhookDto } from './dto/kinti-webhook.dto';
import { ProcesarMensajeDto } from './dto/procesar-mensaje.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { Request } from 'express';

@Controller()
export class KintiController {
  constructor(private readonly kintiService: KintiService) {}

  /**
   * Endpoint consumido por el FRONTEND (Protegido por JWT)
   * Dispara el flujo hacia n8n.
   */
  @Post('kinti/procesar')
  @HttpCode(HttpStatus.ACCEPTED)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async enviarAIA(
    @Body() dto: ProcesarMensajeDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    // Validar que el usuario solo puede procesar para sí mismo
    if (dto.usuario_id !== req.user.id) {
      throw new UnauthorizedException(
        'No puedes procesar datos en nombre de otro usuario',
      );
    }

    // Retorna la promesa, que no bloquea la respuesta final de la IA
    return this.kintiService.sendMessageToAI(dto.usuario_id, dto.mensaje, file);
  }

  /**
   * Endpoint consumido por el FRONTEND (Protegido por JWT)
   * Polling para obtener la respuesta pendiente de n8n
   */
  @Get('kinti/respuesta')
  @UseGuards(JwtAuthGuard)
  async obtenerRespuesta(
    @Req() req: any,
    @Query('requestId') requestId: string,
  ) {
    return this.kintiService.obtenerRespuesta(req.user.id, requestId);
  }

  @Get('kinti/historial')
  @UseGuards(JwtAuthGuard)
  async historial(@Req() req: any) {
    return this.kintiService.historial(req.user.id);
  }

  /**
   * Endpoint consumido por N8N (Público, pero debe usar un Secret Header)
   */
  @Post('kinti-webhook')
  @HttpCode(HttpStatus.OK)
  async recibirCallbackDeIA(
    @Body() payload: KintiWebhookDto,
    @Req() request: Request,
  ) {
    // Validación de seguridad (El secret debe coincidir con el configurado en el nodo HTTP de n8n)
    const webhookSecret = process.env.N8N_WEBHOOK_SECRET;
    const clientSecret = request.headers['x-kinti-secret'];

    if (!webhookSecret || clientSecret !== webhookSecret) {
      throw new UnauthorizedException('Secret de webhook inválido');
    }

    // Procesar asíncronamente para liberar rápido la conexión a n8n
    // NO usamos "await" para no bloquear la respuesta 200 OK a n8n si la BD está lenta
    this.kintiService.procesarCallbackN8n(payload).catch((err) => {
      console.error('Error procesando callback de n8n en background', err);
    });

    return { success: true, message: 'Callback recibido correctamente' };
  }

  @Post('budgets/webhook')
  @HttpCode(HttpStatus.OK)
  async recibirCallbackPresupuestos(
    @Body() payload: any,
    @Req() request: Request,
  ) {
    const webhookSecret = process.env.N8N_WEBHOOK_SECRET;
    const clientSecret = request.headers['x-kinti-secret'];
    if (!webhookSecret || clientSecret !== webhookSecret) throw new UnauthorizedException('Secret de webhook inválido');

    this.kintiService.procesarCallbackPresupuesto(payload).catch((err) => {
      console.error('Error procesando callback de presupuesto', err);
    });
    return { success: true, message: 'Callback recibido correctamente' };
  }

  @Post('support/webhook')
  @HttpCode(HttpStatus.OK)
  async recibirCallbackSoporte(
    @Body() payload: any,
    @Req() request: Request,
  ) {
    const webhookSecret = process.env.N8N_WEBHOOK_SECRET;
    const clientSecret = request.headers['x-kinti-secret'];
    if (!webhookSecret || clientSecret !== webhookSecret) throw new UnauthorizedException('Secret de webhook inválido');

    this.kintiService.procesarCallbackSoporte(payload).catch((err) => {
      console.error('Error procesando callback de soporte', err);
    });
    return { success: true, message: 'Callback recibido correctamente' };
  }
}
