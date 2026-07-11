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
    async findAll(userId, filters) {
        const where = { userId };
        if (filters?.leida !== undefined) {
            where.read = filters.leida;
        }
        const alerts = await this.prisma.alert.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: { budget: true },
        });
        return alerts.map((a) => ({
            id: a.id,
            usuario_id: a.userId,
            tipo: a.type,
            mensaje: a.message,
            leida: a.read,
            presupuesto: {
                id: a.budget.id,
                categoria: a.budget.category,
                monto: a.budget.amount,
            },
            created_at: a.createdAt,
        }));
    }
    async markAsRead(id, userId) {
        const alert = await this.prisma.alert.findUnique({ where: { id } });
        if (!alert) {
            throw new common_1.NotFoundException('Alerta no encontrada');
        }
        if (alert.userId !== userId) {
            throw new common_1.NotFoundException('Alerta no pertenece al usuario');
        }
        const updated = await this.prisma.alert.update({
            where: { id },
            data: { read: true },
        });
        return {
            id: updated.id,
            leida: updated.read,
        };
    }
    async getUnreadCount(userId) {
        const count = await this.prisma.alert.count({
            where: { userId, read: false },
        });
        return { no_leidas: count };
    }
    async create(userId, budgetId, type, message) {
        const alert = await this.prisma.alert.create({
            data: {
                userId,
                budgetId,
                type,
                message,
            },
        });
        return {
            id: alert.id,
            tipo: alert.type,
            mensaje: alert.message,
            created_at: alert.createdAt,
        };
    }
    async remove(id, userId) {
        const alert = await this.prisma.alert.findUnique({ where: { id } });
        if (!alert) {
            throw new common_1.NotFoundException('Alerta no encontrada');
        }
        if (alert.userId !== userId) {
            throw new common_1.NotFoundException('Alerta no pertenece al usuario');
        }
        await this.prisma.alert.delete({ where: { id } });
        return { deleted: true };
    }
};
exports.AlertsService = AlertsService;
exports.AlertsService = AlertsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AlertsService);
//# sourceMappingURL=alerts.service.js.map