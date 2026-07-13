import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { SupportService } from './support.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { CreateKbEntryDto } from './dto/create-kb-entry.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller()
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @UseGuards(JwtAuthGuard)
  @Post('tickets')
  createTicket(@Request() req, @Body() dto: CreateTicketDto) {
    return this.supportService.createTicket(req.user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('tickets')
  findTickets(@Request() req) {
    return this.supportService.findTickets(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('tickets/:id')
  findTicketById(@Request() req, @Param('id') id: string) {
    return this.supportService.findTicketById(req.user.id, id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('tickets/:id/messages')
  addTicketMessage(
    @Request() req,
    @Param('id') id: string,
    @Body() dto: CreateMessageDto,
  ) {
    return this.supportService.addTicketMessage(req.user.id, id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('knowledge-base')
  createKnowledgeBaseEntry(@Body() dto: CreateKbEntryDto) {
    return this.supportService.createKnowledgeBaseEntry(dto);
  }

  @Get('knowledge-base')
  findKnowledgeBase() {
    return this.supportService.findKnowledgeBase();
  }
}
