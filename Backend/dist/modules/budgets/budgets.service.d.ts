import { PrismaService } from '../../prisma/prisma.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
export declare class BudgetsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, dto: CreateBudgetDto): Promise<{
        id: string;
        createdAt: Date;
        year: number;
        category: string;
        amount: number;
        month: number;
        threshold: number;
        userId: string;
    }>;
    findAll(userId: string): Promise<{
        id: string;
        createdAt: Date;
        year: number;
        category: string;
        amount: number;
        month: number;
        threshold: number;
        userId: string;
    }[]>;
    findOne(userId: string, id: string): Promise<{
        id: string;
        createdAt: Date;
        year: number;
        category: string;
        amount: number;
        month: number;
        threshold: number;
        userId: string;
    }>;
    update(userId: string, id: string, dto: UpdateBudgetDto): Promise<{
        id: string;
        createdAt: Date;
        year: number;
        category: string;
        amount: number;
        month: number;
        threshold: number;
        userId: string;
    }>;
    remove(userId: string, id: string): Promise<{
        id: string;
        createdAt: Date;
        year: number;
        category: string;
        amount: number;
        month: number;
        threshold: number;
        userId: string;
    }>;
}
