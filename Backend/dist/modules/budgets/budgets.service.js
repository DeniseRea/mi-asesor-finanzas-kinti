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
exports.BudgetsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let BudgetsService = class BudgetsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
<<<<<<< HEAD
    async create(dto) {
        const userId = dto.usuario_id;
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException('Usuario no encontrado');
        }
        const budget = await this.prisma.budget.create({
            data: {
                userId,
                category: dto.categoria,
                amount: dto.monto,
                month: dto.mes,
                year: dto.anio,
                threshold: dto.umbral || 80,
            },
        });
        return {
            id: budget.id,
            usuario_id: budget.userId,
            categoria: budget.category,
            monto: budget.amount,
            mes: budget.month,
            anio: budget.year,
            umbral: budget.threshold,
            created_at: budget.createdAt,
        };
    }
    async findAll(userId, filters) {
        const where = { userId };
        if (filters?.mes) {
            where.month = filters.mes;
        }
        if (filters?.anio) {
            where.year = filters.anio;
        }
        const budgets = await this.prisma.budget.findMany({
            where,
            orderBy: [{ year: 'desc' }, { month: 'desc' }],
        });
        return budgets.map((b) => ({
            id: b.id,
            usuario_id: b.userId,
            categoria: b.category,
            monto: b.amount,
            mes: b.month,
            anio: b.year,
            umbral: b.threshold,
            created_at: b.createdAt,
        }));
    }
    async getStatus(userId, categoria) {
        const now = new Date();
        const month = now.getMonth() + 1;
        const year = now.getFullYear();
        const budget = await this.prisma.budget.findFirst({
            where: { userId, category: categoria, month, year },
        });
        if (!budget) {
            return {
                categoria,
                mes: month,
                anio: year,
                tiene_presupuesto: false,
            };
        }
        const startOfMonth = new Date(year, month - 1, 1);
        const endOfMonth = new Date(year, month, 0, 23, 59, 59);
        const transactions = await this.prisma.transaction.findMany({
            where: {
                userId,
                category: categoria,
                type: 'GASTO',
                date: { gte: startOfMonth, lte: endOfMonth },
            },
        });
        const gastado = transactions.reduce((sum, t) => sum + t.amount, 0);
        const restante = budget.amount - gastado;
        const porcentaje = budget.amount > 0 ? (gastado / budget.amount) * 100 : 0;
        const superado = porcentaje >= budget.threshold;
        return {
            categoria,
            mes: month,
            anio: year,
            tiene_presupuesto: true,
            presupuesto: budget.amount,
            gastado,
            restante,
            porcentaje_uso: Math.round(porcentaje * 100) / 100,
            umbral: budget.threshold,
            superado,
        };
    }
    async update(id, userId, dto) {
        const budget = await this.prisma.budget.findUnique({ where: { id } });
        if (!budget) {
            throw new common_1.NotFoundException('Presupuesto no encontrado');
        }
        if (budget.userId !== userId) {
            throw new common_1.NotFoundException('Presupuesto no pertenece al usuario');
        }
        const updated = await this.prisma.budget.update({
            where: { id },
            data: {
                ...(dto.monto !== undefined && { amount: dto.monto }),
                ...(dto.umbral !== undefined && { threshold: dto.umbral }),
            },
        });
        return {
            id: updated.id,
            usuario_id: updated.userId,
            categoria: updated.category,
            monto: updated.amount,
            mes: updated.month,
            anio: updated.year,
            umbral: updated.threshold,
        };
    }
    async remove(id, userId) {
        const budget = await this.prisma.budget.findUnique({ where: { id } });
        if (!budget) {
            throw new common_1.NotFoundException('Presupuesto no encontrado');
        }
        if (budget.userId !== userId) {
            throw new common_1.NotFoundException('Presupuesto no pertenece al usuario');
        }
        await this.prisma.budget.delete({ where: { id } });
        return { deleted: true };
=======
    async create(userId, dto) {
        return this.prisma.budget.create({
            data: {
                userId,
                category: dto.category,
                amount: dto.amount,
                month: dto.month,
                year: dto.year,
                threshold: dto.threshold ?? 80,
            },
        });
    }
    async findAll(userId) {
        return this.prisma.budget.findMany({
            where: { userId },
        });
    }
    async findOne(userId, id) {
        const budget = await this.prisma.budget.findUnique({
            where: { id },
        });
        if (!budget || budget.userId !== userId) {
            throw new common_1.NotFoundException('Presupuesto no encontrado');
        }
        return budget;
    }
    async update(userId, id, dto) {
        await this.findOne(userId, id);
        return this.prisma.budget.update({
            where: { id },
            data: {
                category: dto.category,
                amount: dto.amount,
                month: dto.month,
                year: dto.year,
                threshold: dto.threshold,
            },
        });
    }
    async remove(userId, id) {
        await this.findOne(userId, id);
        return this.prisma.budget.delete({
            where: { id },
        });
>>>>>>> main
    }
};
exports.BudgetsService = BudgetsService;
exports.BudgetsService = BudgetsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BudgetsService);
//# sourceMappingURL=budgets.service.js.map