import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { AlertsService } from '../alerts/alerts.service';
import * as Papa from 'papaparse';

@Injectable()
export class TransactionsService {
  constructor(
    private prisma: PrismaService,
    private alertsService: AlertsService,
  ) {}

  async create(dto: CreateTransactionDto) {
    const userId = dto.usuario_id;
    if (!userId) {
      throw new BadRequestException('usuario_id es requerido');
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const transaction = await this.prisma.transaction.create({
      data: {
        userId,
        amount: dto.monto,
        type: dto.accion,
        category: dto.categoria,
        entity: dto.entidad,
        date: dto.fecha ? new Date(dto.fecha) : new Date(),
        description: dto.descripcion,
        confirmed: true,
      },
    });

    // Si es un gasto/egreso, evaluar alertas de presupuestos
    if (
      transaction.type === 'GASTO' ||
      transaction.type === 'expense' ||
      transaction.type === 'gasto'
    ) {
      try {
        await this.alertsService.onTransactionCreated({
          userId: transaction.userId,
          category: transaction.category,
          amount: transaction.amount,
          date: transaction.date,
        });
      } catch (error) {
        console.error('Error al generar alerta de presupuesto:', error);
      }
    }

    return {
      id: transaction.id,
      usuario_id: transaction.userId,
      accion: transaction.type,
      monto: transaction.amount,
      categoria: transaction.category,
      entidad: transaction.entity,
      fecha: transaction.date.toISOString().split('T')[0],
      confirmado: transaction.confirmed,
      created_at: transaction.createdAt,
    };
  }

  async findAll(
    userId: string,
    filters?: { type?: string; category?: string; from?: string; to?: string },
  ) {
    const where: any = { userId };

    if (filters?.type) {
      where.type = filters.type;
    }
    if (filters?.category) {
      where.category = filters.category;
    }
    if (filters?.from || filters?.to) {
      where.date = {};
      if (filters.from) {
        where.date.gte = new Date(filters.from);
      }
      if (filters.to) {
        const end = new Date(filters.to);
        end.setHours(23, 59, 59, 999);
        where.date.lte = end;
      }
    }

    const transactions = await this.prisma.transaction.findMany({
      where,
      orderBy: { date: 'desc' },
    });

    return transactions.map((t) => ({
      id: t.id,
      usuario_id: t.userId,
      accion: t.type,
      monto: t.amount,
      categoria: t.category,
      entidad: t.entity,
      fecha: t.date.toISOString().split('T')[0],
      descripcion: t.description,
      confirmado: t.confirmed,
      created_at: t.createdAt,
    }));
  }

  async getSummary(userId: string) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
    );

    const transactions = await this.prisma.transaction.findMany({
      where: {
        userId,
        date: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    });

    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    const totalIngresos = transactions
      .filter((t) => t.type === 'INGRESO')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalGastos = transactions
      .filter((t) => t.type === 'GASTO')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      usuario_id: userId,
      moneda: user?.currency || 'USD',
      total_ingresos: totalIngresos,
      total_gastos: totalGastos,
      saldo: totalIngresos - totalGastos,
      periodo: {
        mes: now.getMonth() + 1,
        anio: now.getFullYear(),
      },
    };
  }

  async parseCsv(csvContent: string) {
    const result = Papa.parse(csvContent, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header: string) => header.trim().toLowerCase(),
    });

    if (result.errors.length > 0) {
      throw new BadRequestException(
        `Errores al parsear CSV: ${result.errors.map((e) => e.message).join(', ')}`,
      );
    }

    const validTransactions: CreateTransactionDto[] = [];
    const errors: { row: number; message: string; data: any }[] = [];

    result.data.forEach((row: any, index: number) => {
      try {
        if (!row.monto && !row.amount) {
          throw new Error('Monto requerido');
        }
        if (!row.tipo && !row.type) {
          throw new Error('Tipo requerido (INGRESO/GASTO)');
        }

        const amount = parseFloat(row.monto || row.amount);
        if (isNaN(amount) || amount <= 0) {
          throw new Error('Monto debe ser un número positivo');
        }

        const type = (row.tipo || row.type || '').toUpperCase();
        if (type !== 'INGRESO' && type !== 'GASTO') {
          throw new Error('Tipo debe ser INGRESO o GASTO');
        }

        validTransactions.push({
          usuario_id: '',
          accion: type,
          monto: amount,
          categoria: row.categoria || row.category || 'otros',
          entidad: row.entidad || row.entity || undefined,
          fecha:
            row.fecha || row.date || new Date().toISOString().split('T')[0],
          descripcion: row.descripcion || row.description || undefined,
        });
      } catch (e) {
        errors.push({
          row: index + 1,
          message: e.message,
          data: row,
        });
      }
    });

    return {
      valid: validTransactions,
      errors,
      total_rows: result.data.length,
      valid_count: validTransactions.length,
      error_count: errors.length,
    };
  }

  async importCsv(userId: string, transactions: CreateTransactionDto[]) {
    const created = await this.prisma.transaction.createMany({
      data: transactions.map((t) => ({
        userId,
        amount: t.monto,
        type: t.accion,
        category: t.categoria,
        entity: t.entidad,
        date: t.fecha ? new Date(t.fecha) : new Date(),
        description: t.descripcion,
        confirmed: true,
      })),
    });

    for (const item of transactions.filter(
      (transaction) => transaction.accion === 'GASTO',
    )) {
      await this.alertsService.onTransactionCreated({
        userId,
        category: item.categoria,
        amount: item.monto,
        date: item.fecha ? new Date(item.fecha) : new Date(),
      });
    }
    return {
      imported: created.count,
      usuario_id: userId,
    };
  }

  async remove(id: string, userId: string) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
    });
    if (!transaction) {
      throw new NotFoundException('Transacción no encontrada');
    }
    if (transaction.userId !== userId) {
      throw new NotFoundException('Transacción no pertenece al usuario');
    }

    await this.prisma.transaction.delete({ where: { id } });
    if (['GASTO', 'expense', 'gasto'].includes(transaction.type))
      await this.alertsService.onTransactionCreated({
        userId,
        category: transaction.category,
        amount: 0,
        date: transaction.date,
      });
    return { deleted: true };
  }
}
