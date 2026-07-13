import { Test, TestingModule } from '@nestjs/testing';
import { BudgetsService } from './budgets.service';
import { PrismaService } from '../../prisma/prisma.service';
import mockPrismaService from '../../prisma/__mocks__/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { createBudget } from '../../test-utils/factories';

describe('BudgetsService', () => {
  let service: BudgetsService;
  let prisma: typeof mockPrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BudgetsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<BudgetsService>(BudgetsService);
    prisma = module.get(PrismaService) as typeof mockPrismaService;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create budget with default threshold', async () => {
      const dto = { category: 'comida', amount: 500, month: 7, year: 2026 };
      prisma.budget.create.mockResolvedValue(createBudget({ ...dto, threshold: 80 }));

      await service.create('user-1', dto);

      expect(prisma.budget.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ ...dto, threshold: 80, userId: 'user-1' }),
      });
    });

    it('should create budget with custom threshold', async () => {
      const dto = { category: 'comida', amount: 500, month: 7, year: 2026, threshold: 90 };
      await service.create('user-1', dto);

      expect(prisma.budget.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ threshold: 90 }),
      });
    });
  });

  describe('findAll', () => {
    it('should list budgets of the user', async () => {
      prisma.budget.findMany.mockResolvedValue([createBudget()]);
      const result = await service.findAll('user-1');
      expect(result.length).toBe(1);
      expect(prisma.budget.findMany).toHaveBeenCalledWith({ where: { userId: 'user-1' } });
    });
  });

  describe('findOne', () => {
    it('should find budget if belongs to user', async () => {
      prisma.budget.findUnique.mockResolvedValue(createBudget({ userId: 'user-1' }));
      const result = await service.findOne('user-1', 'budget-1');
      expect(result.userId).toBe('user-1');
    });

    it('should throw NotFoundException if not found', async () => {
      prisma.budget.findUnique.mockResolvedValue(null);
      await expect(service.findOne('user-1', 'budget-1')).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if belongs to other user', async () => {
      prisma.budget.findUnique.mockResolvedValue(createBudget({ userId: 'user-2' }));
      await expect(service.findOne('user-1', 'budget-1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update successfully', async () => {
      prisma.budget.findUnique.mockResolvedValue(createBudget({ userId: 'user-1' }));
      prisma.budget.update.mockResolvedValue(createBudget({ amount: 600 }));

      const result = await service.update('user-1', 'budget-1', { amount: 600 });
      
      expect(prisma.budget.update).toHaveBeenCalledWith({
        where: { id: 'budget-1' },
        data: expect.objectContaining({ amount: 600 }),
      });
      expect(result.amount).toBe(600);
    });

    it('should throw if updating other user budget', async () => {
      prisma.budget.findUnique.mockResolvedValue(createBudget({ userId: 'user-2' }));
      await expect(service.update('user-1', 'budget-1', { amount: 600 })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove successfully', async () => {
      prisma.budget.findUnique.mockResolvedValue(createBudget({ userId: 'user-1' }));
      await service.remove('user-1', 'budget-1');
      expect(prisma.budget.delete).toHaveBeenCalledWith({ where: { id: 'budget-1' } });
    });

    it('should throw if removing other user budget', async () => {
      prisma.budget.findUnique.mockResolvedValue(createBudget({ userId: 'user-2' }));
      await expect(service.remove('user-1', 'budget-1')).rejects.toThrow(NotFoundException);
    });
  });
});
