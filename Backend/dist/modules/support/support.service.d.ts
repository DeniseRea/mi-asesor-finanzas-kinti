import { PrismaService } from '../../prisma/prisma.service';
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
}
