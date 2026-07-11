import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';

@Injectable()
export class BudgetsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateBudgetDto) {
    const userId = dto.usuario_id!;
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const budget = await this.prisma.budget.create({
      data: {
        userId,
        category: dto.categoria,
        amount: dto.monto,
        month: dto.mes,
        year: dto.anio,
        threshold: dto.umbral || 80,
      },
    });

    return {
      id: budget.id,
      usuario_id: budget.userId,
      categoria: budget.category,
      monto: budget.amount,
      mes: budget.month,
      anio: budget.year,
      umbral: budget.threshold,
      created_at: budget.createdAt,
    };
  }

  async findAll(userId: string, filters?: { mes?: number; anio?: number }) {
    const where: any = { userId };

    if (filters?.mes) {
      where.month = filters.mes;
    }
    if (filters?.anio) {
      where.year = filters.anio;
    }

    const budgets = await this.prisma.budget.findMany({
      where,
      orderBy: [{ year: 'desc' }, { month: 'desc' }],
    });

    return budgets.map((b) => ({
      id: b.id,
      usuario_id: b.userId,
      categoria: b.category,
      monto: b.amount,
      mes: b.month,
      anio: b.year,
      umbral: b.threshold,
      created_at: b.createdAt,
    }));
  }

  async getStatus(userId: string, categoria: string) {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    const budget = await this.prisma.budget.findFirst({
      where: { userId, category: categoria, month, year },
    });

    if (!budget) {
      return {
        categoria,
        mes: month,
        anio: year,
        tiene_presupuesto: false,
      };
    }

    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59);

    const transactions = await this.prisma.transaction.findMany({
      where: {
        userId,
        category: categoria,
        type: 'GASTO',
        date: { gte: startOfMonth, lte: endOfMonth },
      },
    });

    const gastado = transactions.reduce((sum, t) => sum + t.amount, 0);
    const restante = budget.amount - gastado;
    const porcentaje = budget.amount > 0 ? (gastado / budget.amount) * 100 : 0;
    const superado = porcentaje >= budget.threshold;

    return {
      categoria,
      mes: month,
      anio: year,
      tiene_presupuesto: true,
      presupuesto: budget.amount,
      gastado,
      restante,
      porcentaje_uso: Math.round(porcentaje * 100) / 100,
      umbral: budget.threshold,
      superado,
    };
  }

  async update(id: string, userId: string, dto: UpdateBudgetDto) {
    const budget = await this.prisma.budget.findUnique({ where: { id } });
    if (!budget) {
      throw new NotFoundException('Presupuesto no encontrado');
    }
    if (budget.userId !== userId) {
      throw new NotFoundException('Presupuesto no pertenece al usuario');
    }

    const updated = await this.prisma.budget.update({
      where: { id },
      data: {
        ...(dto.monto !== undefined && { amount: dto.monto }),
        ...(dto.umbral !== undefined && { threshold: dto.umbral }),
      },
    });

    return {
      id: updated.id,
      usuario_id: updated.userId,
      categoria: updated.category,
      monto: updated.amount,
      mes: updated.month,
      anio: updated.year,
      umbral: updated.threshold,
    };
  }

  async remove(id: string, userId: string) {
    const budget = await this.prisma.budget.findUnique({ where: { id } });
    if (!budget) {
      throw new NotFoundException('Presupuesto no encontrado');
    }
    if (budget.userId !== userId) {
      throw new NotFoundException('Presupuesto no pertenece al usuario');
    }

    await this.prisma.budget.delete({ where: { id } });
    return { deleted: true };
  }
}
