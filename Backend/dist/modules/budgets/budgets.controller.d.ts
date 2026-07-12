import { BudgetsService } from './budgets.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
export declare class BudgetsController {
<<<<<<< HEAD
    private budgetsService;
    constructor(budgetsService: BudgetsService);
    webhook(dto: CreateBudgetDto): Promise<{
        id: string;
        usuario_id: string;
        categoria: string;
        monto: number;
        mes: number;
        anio: number;
        umbral: number;
        created_at: Date;
    }>;
    create(dto: CreateBudgetDto, req: any): Promise<{
        id: string;
        usuario_id: string;
        categoria: string;
        monto: number;
        mes: number;
        anio: number;
        umbral: number;
        created_at: Date;
    }>;
    findAll(req: any, mes?: string, anio?: string): Promise<{
        id: string;
        usuario_id: string;
        categoria: string;
        monto: number;
        mes: number;
        anio: number;
        umbral: number;
        created_at: Date;
    }[]>;
    getStatus(req: any, categoria: string): Promise<{
        categoria: string;
        mes: number;
        anio: number;
        tiene_presupuesto: boolean;
        presupuesto?: undefined;
        gastado?: undefined;
        restante?: undefined;
        porcentaje_uso?: undefined;
        umbral?: undefined;
        superado?: undefined;
    } | {
        categoria: string;
        mes: number;
        anio: number;
        tiene_presupuesto: boolean;
        presupuesto: number;
        gastado: number;
        restante: number;
        porcentaje_uso: number;
        umbral: number;
        superado: boolean;
    }>;
    update(id: string, dto: UpdateBudgetDto, req: any): Promise<{
        id: string;
        usuario_id: string;
        categoria: string;
        monto: number;
        mes: number;
        anio: number;
        umbral: number;
    }>;
    remove(id: string, req: any): Promise<{
        deleted: boolean;
=======
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
>>>>>>> main
    }>;
}
