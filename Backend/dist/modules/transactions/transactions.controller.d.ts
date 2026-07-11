import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { ImportCsvDto } from './dto/import-csv.dto';
export declare class TransactionsController {
    private transactionsService;
    constructor(transactionsService: TransactionsService);
    webhook(dto: CreateTransactionDto): Promise<{
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
    create(dto: CreateTransactionDto, req: any): Promise<{
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
    findAll(req: any, type?: string, category?: string, from?: string, to?: string): Promise<{
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
    getSummary(req: any): Promise<{
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
    parseCsv(body: {
        csv: string;
    }): Promise<{
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
    importCsv(dto: ImportCsvDto, req: any): Promise<{
        imported: number;
        usuario_id: string;
    }>;
    remove(id: string, req: any): Promise<{
        deleted: boolean;
    }>;
}
