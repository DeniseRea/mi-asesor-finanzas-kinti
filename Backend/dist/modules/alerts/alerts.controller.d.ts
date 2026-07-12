import { AlertsService } from './alerts.service';
export declare class AlertsController {
<<<<<<< HEAD
    private alertsService;
    constructor(alertsService: AlertsService);
    findAll(req: any, leida?: string): Promise<{
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
    getUnreadCount(req: any): Promise<{
        no_leidas: number;
    }>;
    markAsRead(id: string, req: any): Promise<{
        id: string;
        leida: boolean;
    }>;
    remove(id: string, req: any): Promise<{
        deleted: boolean;
=======
    private readonly alertsService;
    constructor(alertsService: AlertsService);
    findAll(req: any): Promise<({
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
    markAsRead(req: any, id: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        budgetId: string;
        type: string;
        message: string;
        read: boolean;
>>>>>>> main
    }>;
}
