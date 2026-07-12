import { SupportService } from './support.service';
<<<<<<< HEAD
import { CreateTicketDto, CreateTicketMessageDto } from './dto/create-ticket.dto';
import { CreateKnowledgeBaseDto } from './dto/create-knowledge-base.dto';
export declare class SupportController {
    private supportService;
    constructor(supportService: SupportService);
    createTicket(dto: CreateTicketDto): Promise<{
        id: string;
        usuario_id: string;
        asunto: string;
        estado: string;
        prioridad: string;
        created_at: Date;
    }>;
    findAll(req: any, estado?: string): Promise<{
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
    findOne(id: string, req: any): Promise<{
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
    addMessage(id: string, dto: CreateTicketMessageDto): Promise<{
        id: string;
        ticket_id: string;
        rol: string;
        contenido: string;
        created_at: Date;
    }>;
    updateStatus(id: string, body: {
        estado: string;
    }, req: any): Promise<{
        id: string;
        estado: string;
    }>;
    removeTicket(id: string, req: any): Promise<{
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
    findAllKnowledgeBase(categoria?: string, activo?: string): Promise<{
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
export declare class SupportController {
    private readonly supportService;
    constructor(supportService: SupportService);
    createTicket(req: any, dto: CreateTicketDto): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        subject: string;
        status: string;
        priority: string;
        context: string | null;
    }>;
    findTickets(req: any): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        subject: string;
        status: string;
        priority: string;
        context: string | null;
    }[]>;
    findTicketById(req: any, id: string): Promise<{
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
    addTicketMessage(req: any, id: string, dto: CreateMessageDto): Promise<{
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
