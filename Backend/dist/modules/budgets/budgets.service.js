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
    }
};
exports.BudgetsService = BudgetsService;
exports.BudgetsService = BudgetsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BudgetsService);
//# sourceMappingURL=budgets.service.js.map