import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AlertsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.alert.findMany({
      where: { userId },
      include: {
        budget: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async markAsRead(userId: string, id: string) {
    const alert = await this.prisma.alert.findUnique({
      where: { id },
    });

    if (!alert || alert.userId !== userId) {
      throw new NotFoundException('Alerta no encontrada');
    }

    return this.prisma.alert.update({
      where: { id },
      data: { read: true },
    });
  }

  /**
   * Lógica para verificar el umbral y generar alertas al crear un gasto.
   * 
   * TODO (Julio): Llama a este método en tu servicio de Transacciones (RF-02)
   * justo después de crear exitosamente una transacción de tipo gasto/egreso.
   * Ejemplo:
   *   await this.alertsService.onTransactionCreated({
   *     userId: transaction.userId,
   *     category: transaction.category,
   *     amount: transaction.amount,
   *     date: transaction.date,
   *   });
   */
  async onTransactionCreated(transaction: { userId: string; category: string; amount: number; date: Date }) {
    const txDate = new Date(transaction.date);
    const transactionMonth = txDate.getMonth() + 1;
    const transactionYear = txDate.getFullYear();

    // 1. Buscar si hay presupuestos activos para esta categoría en el mes y año del gasto
    const budgets = await this.prisma.budget.findMany({
      where: {
        userId: transaction.userId,
        category: { equals: transaction.category },
        month: transactionMonth,
        year: transactionYear,
      },
    });

    for (const budget of budgets) {
      // 2. Calcular la suma total gastada en este mes y año para esta categoría
      const startOfMonth = new Date(transactionYear, transactionMonth - 1, 1);
      const endOfMonth = new Date(transactionYear, transactionMonth, 0, 23, 59, 59, 999);

      const expenseAggregate = await this.prisma.transaction.aggregate({
        where: {
          userId: transaction.userId,
          category: budget.category,
          type: { in: ['expense', 'gasto', 'EXPENSE', 'GASTO', 'egreso', 'EGRESO'] },
          date: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
        },
        _sum: {
          amount: true,
        },
      });

      const totalSpent = expenseAggregate._sum.amount || 0;

      // 3. Verificar si se supera el umbral establecido
      const thresholdAmount = budget.amount * (budget.threshold / 100);
      if (totalSpent >= thresholdAmount) {
        // Verificar si ya existe una alerta para este presupuesto específico
        const existingAlert = await this.prisma.alert.findFirst({
          where: { budgetId: budget.id },
        });

        if (!existingAlert) {
          // Crear la alerta
          await this.prisma.alert.create({
            data: {
              userId: transaction.userId,
              budgetId: budget.id,
              type: 'PRESUPUESTO_EXCEDIDO',
              message: `¡Alerta! Has gastado ${totalSpent.toFixed(2)} de un presupuesto de ${budget.amount.toFixed(2)} para la categoría '${budget.category}'. Se ha superado el umbral del ${budget.threshold}%.`,
              read: false,
            },
          });
        }
      }
    }
  }
}
