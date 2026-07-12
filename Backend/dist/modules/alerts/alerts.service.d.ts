import { PrismaService } from '../../prisma/prisma.service';
export declare class AlertsService {
    private prisma;
    constructor(prisma: PrismaService);
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
}
