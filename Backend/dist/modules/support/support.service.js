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
exports.SupportService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let SupportService = class SupportService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createTicket(userId, dto) {
        return this.prisma.ticket.create({
            data: {
                userId,
                subject: dto.subject,
                priority: dto.priority ?? 'media',
                context: dto.context,
                status: 'abierto',
            },
        });
    }
    async findTickets(userId) {
        return this.prisma.ticket.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findTicketById(userId, ticketId) {
        const ticket = await this.prisma.ticket.findUnique({
            where: { id: ticketId },
            include: {
                messages: {
                    orderBy: { createdAt: 'asc' },
                },
            },
        });
        if (!ticket || ticket.userId !== userId) {
            throw new common_1.NotFoundException('Ticket no encontrado');
        }
        return ticket;
    }
    async addTicketMessage(userId, ticketId, dto) {
        await this.findTicketById(userId, ticketId);
        return this.prisma.ticketMessage.create({
            data: {
                ticketId,
                role: dto.role ?? 'user',
                content: dto.content,
            },
        });
    }
    async createKnowledgeBaseEntry(dto) {
        return this.prisma.knowledgeBase.create({
            data: {
                title: dto.title,
                content: dto.content,
                category: dto.category,
                active: true,
            },
        });
    }
    async findKnowledgeBase() {
        return this.prisma.knowledgeBase.findMany({
            where: { active: true },
        });
    }
};
exports.SupportService = SupportService;
exports.SupportService = SupportService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SupportService);
//# sourceMappingURL=support.service.js.map