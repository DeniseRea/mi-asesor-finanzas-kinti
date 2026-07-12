import { SupportService } from './support.service';
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
}
