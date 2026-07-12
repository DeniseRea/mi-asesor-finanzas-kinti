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
<<<<<<< HEAD
    async createTicket(dto) {
        const userId = dto.usuario_id;
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException('Usuario no encontrado');
        }
        const ticket = await this.prisma.ticket.create({
            data: {
                userId,
                subject: dto.asunto,
                context: dto.contexto,
            },
        });
        return {
            id: ticket.id,
            usuario_id: ticket.userId,
            asunto: ticket.subject,
            estado: ticket.status,
            prioridad: ticket.priority,
            created_at: ticket.createdAt,
        };
    }
    async findAll(userId, filters) {
        const where = { userId };
        if (filters?.estado) {
            where.status = filters.estado;
        }
        const tickets = await this.prisma.ticket.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: { messages: { orderBy: { createdAt: 'asc' } } },
        });
        return tickets.map((t) => ({
            id: t.id,
            usuario_id: t.userId,
            asunto: t.subject,
            estado: t.status,
            prioridad: t.priority,
            contexto: t.context,
            mensajes: t.messages.map((m) => ({
                id: m.id,
                rol: m.role,
                contenido: m.content,
                created_at: m.createdAt,
            })),
            created_at: t.createdAt,
        }));
    }
    async findOne(id, userId) {
        const ticket = await this.prisma.ticket.findUnique({
            where: { id },
            include: { messages: { orderBy: { createdAt: 'asc' } } },
        });
        if (!ticket) {
            throw new common_1.NotFoundException('Ticket no encontrado');
        }
        if (ticket.userId !== userId) {
            throw new common_1.NotFoundException('Ticket no pertenece al usuario');
        }
        return {
            id: ticket.id,
            usuario_id: ticket.userId,
            asunto: ticket.subject,
            estado: ticket.status,
            prioridad: ticket.priority,
            contexto: ticket.context,
            mensajes: ticket.messages.map((m) => ({
                id: m.id,
                rol: m.role,
                contenido: m.content,
                created_at: m.createdAt,
            })),
            created_at: ticket.createdAt,
        };
    }
    async addMessage(ticketId, dto) {
        const ticket = await this.prisma.ticket.findUnique({ where: { id: ticketId } });
        if (!ticket) {
            throw new common_1.NotFoundException('Ticket no encontrado');
        }
        const message = await this.prisma.ticketMessage.create({
            data: {
                ticketId,
                role: dto.rol,
                content: dto.contenido,
            },
        });
        return {
            id: message.id,
            ticket_id: ticketId,
            rol: message.role,
            contenido: message.content,
            created_at: message.createdAt,
        };
    }
    async updateStatus(id, userId, status) {
        const ticket = await this.prisma.ticket.findUnique({ where: { id } });
        if (!ticket) {
            throw new common_1.NotFoundException('Ticket no encontrado');
        }
        if (ticket.userId !== userId) {
            throw new common_1.NotFoundException('Ticket no pertenece al usuario');
        }
        const updated = await this.prisma.ticket.update({
            where: { id },
            data: { status },
        });
        return {
            id: updated.id,
            estado: updated.status,
        };
    }
    async removeTicket(id, userId) {
        const ticket = await this.prisma.ticket.findUnique({ where: { id } });
        if (!ticket) {
            throw new common_1.NotFoundException('Ticket no encontrado');
        }
        if (ticket.userId !== userId) {
            throw new common_1.NotFoundException('Ticket no pertenece al usuario');
        }
        await this.prisma.ticketMessage.deleteMany({ where: { ticketId: id } });
        await this.prisma.ticket.delete({ where: { id } });
        return { deleted: true };
    }
    async createKnowledgeBase(dto) {
        const kb = await this.prisma.knowledgeBase.create({
            data: {
                title: dto.titulo,
                content: dto.contenido,
                category: dto.categoria,
                active: dto.activo !== undefined ? dto.activo : true,
            },
        });
        return {
            id: kb.id,
            titulo: kb.title,
            contenido: kb.content,
            categoria: kb.category,
            activo: kb.active,
            updated_at: kb.updatedAt,
        };
    }
    async findAllKnowledgeBase(filters) {
        const where = {};
        if (filters?.categoria) {
            where.category = filters.categoria;
        }
        if (filters?.activo !== undefined) {
            where.active = filters.activo;
        }
        const items = await this.prisma.knowledgeBase.findMany({
            where,
            orderBy: { updatedAt: 'desc' },
        });
        return items.map((kb) => ({
            id: kb.id,
            titulo: kb.title,
            contenido: kb.content,
            categoria: kb.category,
            activo: kb.active,
            updated_at: kb.updatedAt,
        }));
    }
    async removeKnowledgeBase(id) {
        const kb = await this.prisma.knowledgeBase.findUnique({ where: { id } });
        if (!kb) {
            throw new common_1.NotFoundException('Artículo no encontrado');
        }
        await this.prisma.knowledgeBase.delete({ where: { id } });
        return { deleted: true };
=======
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
>>>>>>> main
    }
};
exports.SupportService = SupportService;
exports.SupportService = SupportService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SupportService);
//# sourceMappingURL=support.service.js.map