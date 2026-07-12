import { BudgetsService } from './budgets.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
export declare class BudgetsController {
    private readonly budgetsService;
    constructor(budgetsService: BudgetsService);
    create(req: any, dto: CreateBudgetDto): Promise<{
        id: string;
        createdAt: Date;
        year: number;
        category: string;
        amount: number;
        month: number;
        threshold: number;
        userId: string;
    }>;
    findAll(req: any): Promise<{
        id: string;
        createdAt: Date;
        year: number;
        category: string;
        amount: number;
        month: number;
        threshold: number;
        userId: string;
    }[]>;
    update(req: any, id: string, dto: UpdateBudgetDto): Promise<{
        id: string;
        createdAt: Date;
        year: number;
        category: string;
        amount: number;
        month: number;
        threshold: number;
        userId: string;
    }>;
    remove(req: any, id: string): Promise<{
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
