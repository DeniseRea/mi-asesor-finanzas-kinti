import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTicketDto, CreateTicketMessageDto } from './dto/create-ticket.dto';
import { CreateKnowledgeBaseDto } from './dto/create-knowledge-base.dto';

@Injectable()
export class SupportService {
  constructor(private prisma: PrismaService) {}

  async createTicket(dto: CreateTicketDto) {
    const userId = dto.usuario_id!;
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const ticket = await this.prisma.ticket.create({
      data: {
        userId,
        subject: dto.asunto,
        context: dto.contexto,
      },
    });

    return {
      id: ticket.id,
      usuario_id: ticket.userId,
      asunto: ticket.subject,
      estado: ticket.status,
      prioridad: ticket.priority,
      created_at: ticket.createdAt,
    };
  }

  async findAll(userId: string, filters?: { estado?: string }) {
    const where: any = { userId };

    if (filters?.estado) {
      where.status = filters.estado;
    }

    const tickets = await this.prisma.ticket.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { messages: { orderBy: { createdAt: 'asc' } } },
    });

    return tickets.map((t) => ({
      id: t.id,
      usuario_id: t.userId,
      asunto: t.subject,
      estado: t.status,
      prioridad: t.priority,
      contexto: t.context,
      mensajes: t.messages.map((m) => ({
        id: m.id,
        rol: m.role,
        contenido: m.content,
        created_at: m.createdAt,
      })),
      created_at: t.createdAt,
    }));
  }

  async findOne(id: string, userId: string) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id },
      include: { messages: { orderBy: { createdAt: 'asc' } } },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket no encontrado');
    }
    if (ticket.userId !== userId) {
      throw new NotFoundException('Ticket no pertenece al usuario');
    }

    return {
      id: ticket.id,
      usuario_id: ticket.userId,
      asunto: ticket.subject,
      estado: ticket.status,
      prioridad: ticket.priority,
      contexto: ticket.context,
      mensajes: ticket.messages.map((m) => ({
        id: m.id,
        rol: m.role,
        contenido: m.content,
        created_at: m.createdAt,
      })),
      created_at: ticket.createdAt,
    };
  }

  async addMessage(ticketId: string, dto: CreateTicketMessageDto) {
    const ticket = await this.prisma.ticket.findUnique({ where: { id: ticketId } });
    if (!ticket) {
      throw new NotFoundException('Ticket no encontrado');
    }

    const message = await this.prisma.ticketMessage.create({
      data: {
        ticketId,
        role: dto.rol,
        content: dto.contenido,
      },
    });

    return {
      id: message.id,
      ticket_id: ticketId,
      rol: message.role,
      contenido: message.content,
      created_at: message.createdAt,
    };
  }

  async updateStatus(id: string, userId: string, status: string) {
    const ticket = await this.prisma.ticket.findUnique({ where: { id } });
    if (!ticket) {
      throw new NotFoundException('Ticket no encontrado');
    }
    if (ticket.userId !== userId) {
      throw new NotFoundException('Ticket no pertenece al usuario');
    }

    const updated = await this.prisma.ticket.update({
      where: { id },
      data: { status },
    });

    return {
      id: updated.id,
      estado: updated.status,
    };
  }

  async removeTicket(id: string, userId: string) {
    const ticket = await this.prisma.ticket.findUnique({ where: { id } });
    if (!ticket) {
      throw new NotFoundException('Ticket no encontrado');
    }
    if (ticket.userId !== userId) {
      throw new NotFoundException('Ticket no pertenece al usuario');
    }

    await this.prisma.ticketMessage.deleteMany({ where: { ticketId: id } });
    await this.prisma.ticket.delete({ where: { id } });
    return { deleted: true };
  }

  async createKnowledgeBase(dto: CreateKnowledgeBaseDto) {
    const kb = await this.prisma.knowledgeBase.create({
      data: {
        title: dto.titulo,
        content: dto.contenido,
        category: dto.categoria,
        active: dto.activo !== undefined ? dto.activo : true,
      },
    });

    return {
      id: kb.id,
      titulo: kb.title,
      contenido: kb.content,
      categoria: kb.category,
      activo: kb.active,
      updated_at: kb.updatedAt,
    };
  }

  async findAllKnowledgeBase(filters?: { categoria?: string; activo?: boolean }) {
    const where: any = {};

    if (filters?.categoria) {
      where.category = filters.categoria;
    }
    if (filters?.activo !== undefined) {
      where.active = filters.activo;
    }

    const items = await this.prisma.knowledgeBase.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
    });

    return items.map((kb) => ({
      id: kb.id,
      titulo: kb.title,
      contenido: kb.content,
      categoria: kb.category,
      activo: kb.active,
      updated_at: kb.updatedAt,
    }));
  }

  async removeKnowledgeBase(id: string) {
    const kb = await this.prisma.knowledgeBase.findUnique({ where: { id } });
    if (!kb) {
      throw new NotFoundException('Artículo no encontrado');
    }

    await this.prisma.knowledgeBase.delete({ where: { id } });
    return { deleted: true };
  }
}
