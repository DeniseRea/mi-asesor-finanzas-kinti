"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let AlertsService = class AlertsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(userId) {
        return this.prisma.alert.findMany({
            where: { userId },
            include: {
                budget: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    async markAsRead(userId, id) {
        const alert = await this.prisma.alert.findUnique({
            where: { id },
        });
        if (!alert || alert.userId !== userId) {
            throw new common_1.NotFoundException('Alerta no encontrada');
        }
        return this.prisma.alert.update({
            where: { id },
            data: { read: true },
        });
    }
    async onTransactionCreated(transaction) {
        const txDate = new Date(transaction.date);
        const transactionMonth = txDate.getMonth() + 1;
        const transactionYear = txDate.getFullYear();
        const budgets = await this.prisma.budget.findMany({
            where: {
                userId: transaction.userId,
                category: { equals: transaction.category },
                month: transactionMonth,
                year: transactionYear,
            },
        });
        for (const budget of budgets) {
            const startOfMonth = new Date(transactionYear, transactionMonth - 1, 1);
            const endOfMonth = new Date(transactionYear, transactionMonth, 0, 23, 59, 59, 999);
            const expenseAggregate = await this.prisma.transaction.aggregate({
                where: {
                    userId: transaction.userId,
                    category: budget.category,
                    type: { in: ['expense', 'gasto', 'EXPENSE', 'GASTO', 'egreso', 'EGRESO'] },
                    date: {
                        gte: startOfMonth,
                        lte: endOfMonth,
                    },
                },
                _sum: {
                    amount: true,
                },
            });
            const totalSpent = expenseAggregate._sum.amount || 0;
            const thresholdAmount = budget.amount * (budget.threshold / 100);
            if (totalSpent >= thresholdAmount) {
                const existingAlert = await this.prisma.alert.findFirst({
                    where: { budgetId: budget.id },
                });
                if (!existingAlert) {
                    await this.prisma.alert.create({
                        data: {
                            userId: transaction.userId,
                            budgetId: budget.id,
                            type: 'PRESUPUESTO_EXCEDIDO',
                            message: `¡Alerta! Has gastado ${totalSpent.toFixed(2)} de un presupuesto de ${budget.amount.toFixed(2)} para la categoría '${budget.category}'. Se ha superado el umbral del ${budget.threshold}%.`,
                            read: false,
                        },
                    });
                }
            }
        }
    }
};
exports.AlertsService = AlertsService;
exports.AlertsService = AlertsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AlertsService);
//# sourceMappingURL=alerts.service.js.map