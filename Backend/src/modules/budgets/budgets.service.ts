import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';

@Injectable()
export class BudgetsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateBudgetDto) {
    return this.prisma.budget.create({
      data: {
        userId,
        category: dto.category,
        amount: dto.amount,
        month: dto.month,
        year: dto.year,
        threshold: dto.threshold ?? 80,
      },
    });
  }

  async findAll(userId: string, month?: number, year?: number) {
    return this.prisma.budget.findMany({
      where: { userId, ...(month ? { month } : {}), ...(year ? { year } : {}) },
      orderBy: { category: 'asc' },
    });
  }

  async findOne(userId: string, id: string) {
    const budget = await this.prisma.budget.findUnique({
      where: { id },
    });

    if (!budget || budget.userId !== userId) {
      throw new NotFoundException('Presupuesto no encontrado');
    }

    return budget;
  }

  async update(userId: string, id: string, dto: UpdateBudgetDto) {
    // Validate ownership
    await this.findOne(userId, id);

    return this.prisma.budget.update({
      where: { id },
      data: {
        category: dto.category,
        amount: dto.amount,
        month: dto.month,
        year: dto.year,
        threshold: dto.threshold,
      },
    });
  }

  async remove(userId: string, id: string) {
    // Validate ownership
    await this.findOne(userId, id);

    return this.prisma.budget.delete({
      where: { id },
    });
  }
}
