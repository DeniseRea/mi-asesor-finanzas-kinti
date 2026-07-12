import { AlertsService } from './alerts.service';
export declare class AlertsController {
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
    }>;
}
