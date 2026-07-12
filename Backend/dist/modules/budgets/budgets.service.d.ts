import { PrismaService } from '../../prisma/prisma.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
export declare class BudgetsService {
    private prisma;
    constructor(prisma: PrismaService);
<<<<<<< HEAD
    create(dto: CreateBudgetDto): Promise<{
        id: string;
        usuario_id: string;
        categoria: string;
        monto: number;
        mes: number;
        anio: number;
        umbral: number;
        created_at: Date;
    }>;
    findAll(userId: string, filters?: {
        mes?: number;
        anio?: number;
    }): Promise<{
        id: string;
        usuario_id: string;
        categoria: string;
        monto: number;
        mes: number;
        anio: number;
        umbral: number;
        created_at: Date;
    }[]>;
    getStatus(userId: string, categoria: string): Promise<{
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
    update(id: string, userId: string, dto: UpdateBudgetDto): Promise<{
        id: string;
        usuario_id: string;
        categoria: string;
        monto: number;
        mes: number;
        anio: number;
        umbral: number;
    }>;
    remove(id: string, userId: string): Promise<{
        deleted: boolean;
=======
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
>>>>>>> main
    }>;
}
