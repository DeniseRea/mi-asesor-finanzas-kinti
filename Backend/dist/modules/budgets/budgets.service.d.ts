import { PrismaService } from '../../prisma/prisma.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
export declare class BudgetsService {
    private prisma;
    constructor(prisma: PrismaService);
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
    }>;
}
