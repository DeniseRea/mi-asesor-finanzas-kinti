import { Controller, Post, Get, Patch, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { SupportService } from './support.service';
import { CreateTicketDto, CreateTicketMessageDto } from './dto/create-ticket.dto';
import { CreateKnowledgeBaseDto } from './dto/create-knowledge-base.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('tickets')
export class SupportController {
  constructor(private supportService: SupportService) {}

  @Post()
  createTicket(@Body() dto: CreateTicketDto) {
    return this.supportService.createTicket(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Req() req: any, @Query('estado') estado?: string) {
    return this.supportService.findAll(req.user.id, { estado });
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.supportService.findOne(id, req.user.id);
  }

  @Post(':id/messages')
  addMessage(@Param('id') id: string, @Body() dto: CreateTicketMessageDto) {
    return this.supportService.addMessage(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() body: { estado: string }, @Req() req: any) {
    return this.supportService.updateStatus(id, req.user.id, body.estado);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  removeTicket(@Param('id') id: string, @Req() req: any) {
    return this.supportService.removeTicket(id, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('knowledge-base')
  createKnowledgeBase(@Body() dto: CreateKnowledgeBaseDto) {
    return this.supportService.createKnowledgeBase(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('knowledge-base')
  findAllKnowledgeBase(
    @Query('categoria') categoria?: string,
    @Query('activo') activo?: string,
  ) {
    return this.supportService.findAllKnowledgeBase({
      categoria,
      activo: activo !== undefined ? activo === 'true' : undefined,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Delete('knowledge-base/:id')
  removeKnowledgeBase(@Param('id') id: string) {
    return this.supportService.removeKnowledgeBase(id);
  }
}
