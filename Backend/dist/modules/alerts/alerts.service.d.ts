import { PrismaService } from '../../prisma/prisma.service';
export declare class AlertsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(userId: string, filters?: {
        leida?: boolean;
    }): Promise<{
        id: string;
        usuario_id: string;
        tipo: string;
        mensaje: string;
        leida: boolean;
        presupuesto: {
            id: string;
            categoria: string;
            monto: number;
        };
        created_at: Date;
    }[]>;
    markAsRead(id: string, userId: string): Promise<{
        id: string;
        leida: boolean;
    }>;
    getUnreadCount(userId: string): Promise<{
        no_leidas: number;
    }>;
    create(userId: string, budgetId: string, type: string, message: string): Promise<{
        id: string;
        tipo: string;
        mensaje: string;
        created_at: Date;
    }>;
    remove(id: string, userId: string): Promise<{
        deleted: boolean;
    }>;
}
