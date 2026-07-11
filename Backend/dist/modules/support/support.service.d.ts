import { PrismaService } from '../../prisma/prisma.service';
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
}
