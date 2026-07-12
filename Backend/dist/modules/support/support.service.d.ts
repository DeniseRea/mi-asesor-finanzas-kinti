import { PrismaService } from '../../prisma/prisma.service';
<<<<<<< HEAD
import { CreateTicketDto, CreateTicketMessageDto } from './dto/create-ticket.dto';
import { CreateKnowledgeBaseDto } from './dto/create-knowledge-base.dto';
export declare class SupportService {
    private prisma;
    constructor(prisma: PrismaService);
    createTicket(dto: CreateTicketDto): Promise<{
        id: string;
        usuario_id: string;
        asunto: string;
        estado: string;
        prioridad: string;
        created_at: Date;
    }>;
    findAll(userId: string, filters?: {
        estado?: string;
    }): Promise<{
        id: string;
        usuario_id: string;
        asunto: string;
        estado: string;
        prioridad: string;
        contexto: string | null;
        mensajes: {
            id: string;
            rol: string;
            contenido: string;
            created_at: Date;
        }[];
        created_at: Date;
    }[]>;
    findOne(id: string, userId: string): Promise<{
        id: string;
        usuario_id: string;
        asunto: string;
        estado: string;
        prioridad: string;
        contexto: string | null;
        mensajes: {
            id: string;
            rol: string;
            contenido: string;
            created_at: Date;
        }[];
        created_at: Date;
    }>;
    addMessage(ticketId: string, dto: CreateTicketMessageDto): Promise<{
        id: string;
        ticket_id: string;
        rol: string;
        contenido: string;
        created_at: Date;
    }>;
    updateStatus(id: string, userId: string, status: string): Promise<{
        id: string;
        estado: string;
    }>;
    removeTicket(id: string, userId: string): Promise<{
        deleted: boolean;
    }>;
    createKnowledgeBase(dto: CreateKnowledgeBaseDto): Promise<{
        id: string;
        titulo: string;
        contenido: string;
        categoria: string;
        activo: boolean;
        updated_at: Date;
    }>;
    findAllKnowledgeBase(filters?: {
        categoria?: string;
        activo?: boolean;
    }): Promise<{
        id: string;
        titulo: string;
        contenido: string;
        categoria: string;
        activo: boolean;
        updated_at: Date;
    }[]>;
    removeKnowledgeBase(id: string): Promise<{
        deleted: boolean;
    }>;
=======
import { CreateTicketDto } from './dto/create-ticket.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { CreateKbEntryDto } from './dto/create-kb-entry.dto';
export declare class SupportService {
    private prisma;
    constructor(prisma: PrismaService);
    createTicket(userId: string, dto: CreateTicketDto): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        subject: string;
        status: string;
        priority: string;
        context: string | null;
    }>;
    findTickets(userId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        subject: string;
        status: string;
        priority: string;
        context: string | null;
    }[]>;
    findTicketById(userId: string, ticketId: string): Promise<{
        messages: {
            id: string;
            createdAt: Date;
            role: string;
            content: string;
            ticketId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        subject: string;
        status: string;
        priority: string;
        context: string | null;
    }>;
    addTicketMessage(userId: string, ticketId: string, dto: CreateMessageDto): Promise<{
        id: string;
        createdAt: Date;
        role: string;
        content: string;
        ticketId: string;
    }>;
    createKnowledgeBaseEntry(dto: CreateKbEntryDto): Promise<{
        id: string;
        updatedAt: Date;
        category: string;
        content: string;
        title: string;
        active: boolean;
    }>;
    findKnowledgeBase(): Promise<{
        id: string;
        updatedAt: Date;
        category: string;
        content: string;
        title: string;
        active: boolean;
    }[]>;
>>>>>>> main
}
