import { SupportService } from './support.service';
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
}
