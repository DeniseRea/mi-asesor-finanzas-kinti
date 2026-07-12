import { PrismaService } from '../../prisma/prisma.service';
export declare class AlertsService {
    private prisma;
    constructor(prisma: PrismaService);
<<<<<<< HEAD
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
=======
    findAll(userId: string): Promise<({
        budget: {
            id: string;
            createdAt: Date;
            year: number;
            category: string;
            amount: number;
            month: number;
            threshold: number;
            userId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        budgetId: string;
        type: string;
        message: string;
        read: boolean;
    })[]>;
    markAsRead(userId: string, id: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        budgetId: string;
        type: string;
        message: string;
        read: boolean;
    }>;
    onTransactionCreated(transaction: {
        userId: string;
        category: string;
        amount: number;
        date: Date;
    }): Promise<void>;
>>>>>>> main
}
