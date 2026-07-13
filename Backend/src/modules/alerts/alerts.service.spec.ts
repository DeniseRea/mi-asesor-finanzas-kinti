import { Test, TestingModule } from '@nestjs/testing';
import { AlertsService } from './alerts.service';
import { PrismaService } from '../../prisma/prisma.service';
import mockPrismaService from '../../prisma/__mocks__/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { createAlert, createBudget } from '../../test-utils/factories';

describe('AlertsService', () => {
  let service: AlertsService;
  let prisma: typeof mockPrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AlertsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<AlertsService>(AlertsService);
    prisma = module.get(PrismaService) as typeof mockPrismaService;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should list alerts with budget relation included', async () => {
      prisma.alert.findMany.mockResolvedValue([createAlert()]);
      const result = await service.findAll('user-1');
      expect(prisma.alert.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        include: { budget: true },
        orderBy: { createdAt: 'desc' },
      });
      expect(result.length).toBe(1);
    });
  });

  describe('markAsRead', () => {
    it('should mark as read', async () => {
      prisma.alert.findUnique.mockResolvedValue(createAlert({ userId: 'user-1' }));
      prisma.alert.update.mockResolvedValue(createAlert({ read: true }));

      await service.markAsRead('user-1', 'alert-1');
      
      expect(prisma.alert.update).toHaveBeenCalledWith({
        where: { id: 'alert-1' },
        data: { read: true },
      });
    });

    it('should throw NotFoundException if not exists', async () => {
      prisma.alert.findUnique.mockResolvedValue(null);
      await expect(service.markAsRead('user-1', 'alert-1')).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if other user', async () => {
      prisma.alert.findUnique.mockResolvedValue(createAlert({ userId: 'user-2' }));
      await expect(service.markAsRead('user-1', 'alert-1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('onTransactionCreated', () => {
    const tx = { userId: 'user-1', category: 'comida', amount: 50, date: new Date('2026-07-12') };

    it('should NOT create alert if expense is below threshold', async () => {
      const budget = createBudget({ id: 'b1', amount: 100, threshold: 80 }); // threshold = 80
      prisma.budget.findMany.mockResolvedValue([budget]);
      prisma.transaction.aggregate.mockResolvedValue({ _sum: { amount: 50 } } as any); // spent = 50 < 80

      await service.onTransactionCreated(tx);

      expect(prisma.alert.create).not.toHaveBeenCalled();
    });

    it('should create alert if expense surpasses threshold and no previous alert exists', async () => {
      const budget = createBudget({ id: 'b1', amount: 100, threshold: 80, category: 'comida' }); 
      prisma.budget.findMany.mockResolvedValue([budget]);
      prisma.transaction.aggregate.mockResolvedValue({ _sum: { amount: 85 } } as any); // spent = 85 >= 80
      prisma.alert.findFirst.mockResolvedValue(null);

      await service.onTransactionCreated(tx);

      expect(prisma.alert.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          type: 'PRESUPUESTO_EXCEDIDO',
          budgetId: 'b1',
        }),
      });
    });

    it('should NOT create alert if it surpasses threshold but alert already exists', async () => {
      const budget = createBudget({ id: 'b1', amount: 100, threshold: 80 }); 
      prisma.budget.findMany.mockResolvedValue([budget]);
      prisma.transaction.aggregate.mockResolvedValue({ _sum: { amount: 85 } } as any); 
      prisma.alert.findFirst.mockResolvedValue(createAlert()); // already exists

      await service.onTransactionCreated(tx);

      expect(prisma.alert.create).not.toHaveBeenCalled();
    });

    it('should NOT do anything if no budget exists for category', async () => {
      prisma.budget.findMany.mockResolvedValue([]); // no budgets
      
      await service.onTransactionCreated(tx);

      expect(prisma.transaction.aggregate).not.toHaveBeenCalled();
    });
  });
});
