"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const Papa = __importStar(require("papaparse"));
let TransactionsService = class TransactionsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        const user = await this.prisma.user.findUnique({ where: { id: dto.usuario_id } });
        if (!user) {
            throw new common_1.NotFoundException('Usuario no encontrado');
        }
        const transaction = await this.prisma.transaction.create({
            data: {
                userId: dto.usuario_id,
                amount: dto.monto,
                type: dto.accion,
                category: dto.categoria,
                entity: dto.entidad,
                date: dto.fecha ? new Date(dto.fecha) : new Date(),
                description: dto.descripcion,
                confirmed: true,
            },
        });
        return {
            id: transaction.id,
            usuario_id: transaction.userId,
            accion: transaction.type,
            monto: transaction.amount,
            categoria: transaction.category,
            entidad: transaction.entity,
            fecha: transaction.date.toISOString().split('T')[0],
            confirmado: transaction.confirmed,
            created_at: transaction.createdAt,
        };
    }
    async findAll(userId, filters) {
        const where = { userId };
        if (filters?.type) {
            where.type = filters.type;
        }
        if (filters?.category) {
            where.category = filters.category;
        }
        if (filters?.from || filters?.to) {
            where.date = {};
            if (filters.from) {
                where.date.gte = new Date(filters.from);
            }
            if (filters.to) {
                where.date.lte = new Date(filters.to);
            }
        }
        const transactions = await this.prisma.transaction.findMany({
            where,
            orderBy: { date: 'desc' },
        });
        return transactions.map((t) => ({
            id: t.id,
            usuario_id: t.userId,
            accion: t.type,
            monto: t.amount,
            categoria: t.category,
            entidad: t.entity,
            fecha: t.date.toISOString().split('T')[0],
            descripcion: t.description,
            confirmado: t.confirmed,
            created_at: t.createdAt,
        }));
    }
    async getSummary(userId) {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
        const transactions = await this.prisma.transaction.findMany({
            where: {
                userId,
                date: {
                    gte: startOfMonth,
                    lte: endOfMonth,
                },
            },
        });
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        const totalIngresos = transactions
            .filter((t) => t.type === 'INGRESO')
            .reduce((sum, t) => sum + t.amount, 0);
        const totalGastos = transactions
            .filter((t) => t.type === 'GASTO')
            .reduce((sum, t) => sum + t.amount, 0);
        return {
            usuario_id: userId,
            moneda: user?.currency || 'USD',
            total_ingresos: totalIngresos,
            total_gastos: totalGastos,
            saldo: totalIngresos - totalGastos,
            periodo: {
                mes: now.getMonth() + 1,
                anio: now.getFullYear(),
            },
        };
    }
    async parseCsv(csvContent) {
        const result = Papa.parse(csvContent, {
            header: true,
            skipEmptyLines: true,
            transformHeader: (header) => header.trim().toLowerCase(),
        });
        if (result.errors.length > 0) {
            throw new common_1.BadRequestException(`Errores al parsear CSV: ${result.errors.map((e) => e.message).join(', ')}`);
        }
        const validTransactions = [];
        const errors = [];
        result.data.forEach((row, index) => {
            try {
                if (!row.monto && !row.amount) {
                    throw new Error('Monto requerido');
                }
                if (!row.tipo && !row.type) {
                    throw new Error('Tipo requerido (INGRESO/GASTO)');
                }
                const amount = parseFloat(row.monto || row.amount);
                if (isNaN(amount) || amount <= 0) {
                    throw new Error('Monto debe ser un número positivo');
                }
                const type = (row.tipo || row.type || '').toUpperCase();
                if (type !== 'INGRESO' && type !== 'GASTO') {
                    throw new Error('Tipo debe ser INGRESO o GASTO');
                }
                validTransactions.push({
                    usuario_id: '',
                    accion: type,
                    monto: amount,
                    categoria: row.categoria || row.category || 'otros',
                    entidad: row.entidad || row.entity || undefined,
                    fecha: row.fecha || row.date || new Date().toISOString().split('T')[0],
                    descripcion: row.descripcion || row.description || undefined,
                });
            }
            catch (e) {
                errors.push({
                    row: index + 1,
                    message: e.message,
                    data: row,
                });
            }
        });
        return {
            valid: validTransactions,
            errors,
            total_rows: result.data.length,
            valid_count: validTransactions.length,
            error_count: errors.length,
        };
    }
    async importCsv(userId, transactions) {
        const created = await this.prisma.transaction.createMany({
            data: transactions.map((t) => ({
                userId,
                amount: t.monto,
                type: t.accion,
                category: t.categoria,
                entity: t.entidad,
                date: t.fecha ? new Date(t.fecha) : new Date(),
                description: t.descripcion,
                confirmed: true,
            })),
        });
        return {
            imported: created.count,
            usuario_id: userId,
        };
    }
    async remove(id, userId) {
        const transaction = await this.prisma.transaction.findUnique({ where: { id } });
        if (!transaction) {
            throw new common_1.NotFoundException('Transacción no encontrada');
        }
        if (transaction.userId !== userId) {
            throw new common_1.NotFoundException('Transacción no pertenece al usuario');
        }
        await this.prisma.transaction.delete({ where: { id } });
        return { deleted: true };
    }
};
exports.TransactionsService = TransactionsService;
exports.TransactionsService = TransactionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TransactionsService);
//# sourceMappingURL=transactions.service.js.map