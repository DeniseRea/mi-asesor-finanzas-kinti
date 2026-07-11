import { PrismaService } from '../../prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
export declare class TransactionsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateTransactionDto): Promise<{
        id: string;
        usuario_id: string;
        accion: string;
        monto: number;
        categoria: string;
        entidad: string | null;
        fecha: string;
        confirmado: boolean;
        created_at: Date;
    }>;
    findAll(userId: string, filters?: {
        type?: string;
        category?: string;
        from?: string;
        to?: string;
    }): Promise<{
        id: string;
        usuario_id: string;
        accion: string;
        monto: number;
        categoria: string;
        entidad: string | null;
        fecha: string;
        descripcion: string | null;
        confirmado: boolean;
        created_at: Date;
    }[]>;
    getSummary(userId: string): Promise<{
        usuario_id: string;
        moneda: string;
        total_ingresos: number;
        total_gastos: number;
        saldo: number;
        periodo: {
            mes: number;
            anio: number;
        };
    }>;
    parseCsv(csvContent: string): Promise<{
        valid: CreateTransactionDto[];
        errors: {
            row: number;
            message: string;
            data: any;
        }[];
        total_rows: number;
        valid_count: number;
        error_count: number;
    }>;
    importCsv(userId: string, transactions: CreateTransactionDto[]): Promise<{
        imported: number;
        usuario_id: string;
    }>;
    remove(id: string, userId: string): Promise<{
        deleted: boolean;
    }>;
}
