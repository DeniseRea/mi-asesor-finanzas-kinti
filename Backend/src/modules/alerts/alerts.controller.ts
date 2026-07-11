import { Controller, Get, Patch, Delete, Param, Query, UseGuards, Req } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('alerts')
export class AlertsController {
  constructor(private alertsService: AlertsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Req() req: any, @Query('leida') leida?: string) {
    return this.alertsService.findAll(req.user.id, {
      leida: leida !== undefined ? leida === 'true' : undefined,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('unread-count')
  getUnreadCount(@Req() req: any) {
    return this.alertsService.getUnreadCount(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/read')
  markAsRead(@Param('id') id: string, @Req() req: any) {
    return this.alertsService.markAsRead(id, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.alertsService.remove(id, req.user.id);
  }
}
