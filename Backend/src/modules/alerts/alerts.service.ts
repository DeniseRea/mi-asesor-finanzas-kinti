import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AlertsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string, filters?: { leida?: boolean }) {
    const where: any = { userId };

    if (filters?.leida !== undefined) {
      where.read = filters.leida;
    }

    const alerts = await this.prisma.alert.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { budget: true },
    });

    return alerts.map((a) => ({
      id: a.id,
      usuario_id: a.userId,
      tipo: a.type,
      mensaje: a.message,
      leida: a.read,
      presupuesto: {
        id: a.budget.id,
        categoria: a.budget.category,
        monto: a.budget.amount,
      },
      created_at: a.createdAt,
    }));
  }

  async markAsRead(id: string, userId: string) {
    const alert = await this.prisma.alert.findUnique({ where: { id } });
    if (!alert) {
      throw new NotFoundException('Alerta no encontrada');
    }
    if (alert.userId !== userId) {
      throw new NotFoundException('Alerta no pertenece al usuario');
    }

    const updated = await this.prisma.alert.update({
      where: { id },
      data: { read: true },
    });

    return {
      id: updated.id,
      leida: updated.read,
    };
  }

  async getUnreadCount(userId: string) {
    const count = await this.prisma.alert.count({
      where: { userId, read: false },
    });

    return { no_leidas: count };
  }

  async create(userId: string, budgetId: string, type: string, message: string) {
    const alert = await this.prisma.alert.create({
      data: {
        userId,
        budgetId,
        type,
        message,
      },
    });

    return {
      id: alert.id,
      tipo: alert.type,
      mensaje: alert.message,
      created_at: alert.createdAt,
    };
  }

  async remove(id: string, userId: string) {
    const alert = await this.prisma.alert.findUnique({ where: { id } });
    if (!alert) {
      throw new NotFoundException('Alerta no encontrada');
    }
    if (alert.userId !== userId) {
      throw new NotFoundException('Alerta no pertenece al usuario');
    }

    await this.prisma.alert.delete({ where: { id } });
    return { deleted: true };
  }
}
