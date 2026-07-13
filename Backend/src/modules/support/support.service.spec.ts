import { Test, TestingModule } from '@nestjs/testing';
import { SupportService } from './support.service';
import { PrismaService } from '../../prisma/prisma.service';
import mockPrismaService from '../../prisma/__mocks__/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('SupportService', () => {
  let service: SupportService;
  let prisma: typeof mockPrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SupportService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<SupportService>(SupportService);
    prisma = module.get(PrismaService) as typeof mockPrismaService;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createTicket', () => {
    it('should create ticket with default priority', async () => {
      await service.createTicket('user-1', { subject: 'test', context: 'info' });
      expect(prisma.ticket.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ userId: 'user-1', priority: 'media' }),
      });
    });
  });

  describe('findTickets', () => {
    it('should list tickets', async () => {
      prisma.ticket.findMany.mockResolvedValue([]);
      await service.findTickets('user-1');
      expect(prisma.ticket.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('findTicketById', () => {
    it('should return ticket with messages', async () => {
      prisma.ticket.findUnique.mockResolvedValue({ id: 'ticket-1', userId: 'user-1' } as any);
      const result = await service.findTicketById('user-1', 'ticket-1');
      expect(result.id).toBe('ticket-1');
    });

    it('should throw NotFoundException if not found', async () => {
      prisma.ticket.findUnique.mockResolvedValue(null);
      await expect(service.findTicketById('user-1', 'ticket-1')).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if other user', async () => {
      prisma.ticket.findUnique.mockResolvedValue({ id: 'ticket-1', userId: 'user-2' } as any);
      await expect(service.findTicketById('user-1', 'ticket-1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('addTicketMessage', () => {
    it('should add message', async () => {
      prisma.ticket.findUnique.mockResolvedValue({ id: 'ticket-1', userId: 'user-1' } as any);
      await service.addTicketMessage('user-1', 'ticket-1', { content: 'hello' });
      expect(prisma.ticketMessage.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ ticketId: 'ticket-1', role: 'user', content: 'hello' }),
      });
    });
  });

  describe('createKnowledgeBaseEntry', () => {
    it('should create entry', async () => {
      await service.createKnowledgeBaseEntry({ title: 'FAQ', content: 'test', category: 'general' });
      expect(prisma.knowledgeBase.create).toHaveBeenCalled();
    });
  });

  describe('findKnowledgeBase', () => {
    it('should find active entries', async () => {
      prisma.knowledgeBase.findMany.mockResolvedValue([]);
      await service.findKnowledgeBase();
      expect(prisma.knowledgeBase.findMany).toHaveBeenCalledWith({ where: { active: true } });
    });
  });
});
