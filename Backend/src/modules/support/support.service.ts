import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { CreateKbEntryDto } from './dto/create-kb-entry.dto';

@Injectable()
export class SupportService {
  constructor(private prisma: PrismaService) {}

  async createTicket(userId: string, dto: CreateTicketDto) {
    return this.prisma.ticket.create({
      data: {
        userId,
        subject: dto.subject,
        priority: dto.priority ?? 'media',
        context: dto.context,
        status: 'abierto',
      },
    });
  }

  async findTickets(userId: string) {
    return this.prisma.ticket.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findTicketById(userId: string, ticketId: string) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id: ticketId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!ticket || ticket.userId !== userId) {
      throw new NotFoundException('Ticket no encontrado');
    }

    return ticket;
  }

  async addTicketMessage(
    userId: string,
    ticketId: string,
    dto: CreateMessageDto,
  ) {
    // Verificar propiedad/existencia del ticket
    await this.findTicketById(userId, ticketId);

    return this.prisma.ticketMessage.create({
      data: {
        ticketId,
        role: dto.role ?? 'user',
        content: dto.content,
      },
    });
  }

  async createKnowledgeBaseEntry(dto: CreateKbEntryDto) {
    return this.prisma.knowledgeBase.create({
      data: {
        title: dto.title,
        content: dto.content,
        category: dto.category,
        active: true,
      },
    });
  }

  async findKnowledgeBase() {
    return this.prisma.knowledgeBase.findMany({
      where: { active: true },
    });
  }
}
