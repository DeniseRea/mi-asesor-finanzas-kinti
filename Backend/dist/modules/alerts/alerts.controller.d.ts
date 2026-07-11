import { AlertsService } from './alerts.service';
export declare class AlertsController {
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
    }>;
}
