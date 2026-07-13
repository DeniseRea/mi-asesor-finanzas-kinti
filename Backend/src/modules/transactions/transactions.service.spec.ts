import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { PrismaService } from '../../prisma/prisma.service';
import { AlertsService } from '../alerts/alerts.service';
import mockPrismaService from '../../prisma/__mocks__/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { createTransaction, createUser } from '../../test-utils/factories';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let prisma: typeof mockPrismaService;
  let alertsService: jest.Mocked<AlertsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: AlertsService, useValue: { onTransactionCreated: jest.fn() } },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    prisma = module.get(PrismaService) as typeof mockPrismaService;
    alertsService = module.get(AlertsService) as any;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const dto = { usuario_id: 'user-1', monto: 100, accion: 'GASTO', categoria: 'comida' };

    it('should create GASTO and trigger alerts', async () => {
      prisma.user.findUnique.mockResolvedValue(createUser({ id: 'user-1' }));
      prisma.transaction.create.mockResolvedValue(createTransaction({ userId: 'user-1', type: 'GASTO', amount: 100, category: 'comida' }));

      const result = await service.create(dto as any);

      expect(prisma.transaction.create).toHaveBeenCalled();
      expect(alertsService.onTransactionCreated).toHaveBeenCalledWith(expect.objectContaining({
        userId: 'user-1',
        amount: 100,
        category: 'comida',
      }));
      expect(result.accion).toBe('GASTO');
    });

    it('should create INGRESO and NOT trigger alerts', async () => {
      prisma.user.findUnique.mockResolvedValue(createUser({ id: 'user-1' }));
      prisma.transaction.create.mockResolvedValue(createTransaction({ userId: 'user-1', type: 'INGRESO' }));

      await service.create({ ...dto, accion: 'INGRESO' } as any);

      expect(alertsService.onTransactionCreated).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if no usuario_id', async () => {
      await expect(service.create({ ...dto, usuario_id: undefined } as any)).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if user not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      await expect(service.create(dto as any)).rejects.toThrow(NotFoundException);
    });

    it('should not interrupt creation if alertsService fails', async () => {
      prisma.user.findUnique.mockResolvedValue(createUser({ id: 'user-1' }));
      prisma.transaction.create.mockResolvedValue(createTransaction({ userId: 'user-1', type: 'GASTO' }));
      alertsService.onTransactionCreated.mockRejectedValue(new Error('Alerts error'));
      
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      const result = await service.create(dto as any);
      
      expect(result.accion).toBe('GASTO'); // Success despite error
      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });
  });

  describe('findAll', () => {
    it('should list transactions without filters', async () => {
      prisma.transaction.findMany.mockResolvedValue([createTransaction()]);
      const result = await service.findAll('user-1');
      expect(prisma.transaction.findMany).toHaveBeenCalledWith(expect.objectContaining({ where: { userId: 'user-1' } }));
      expect(result.length).toBe(1);
    });

    it('should list with type filter', async () => {
      prisma.transaction.findMany.mockResolvedValue([]);
      await service.findAll('user-1', { type: 'GASTO' });
      expect(prisma.transaction.findMany).toHaveBeenCalledWith(expect.objectContaining({
        where: expect.objectContaining({ type: 'GASTO' }),
      }));
    });

    it('should list with date range', async () => {
      prisma.transaction.findMany.mockResolvedValue([]);
      await service.findAll('user-1', { from: '2026-01-01', to: '2026-01-31' });
      expect(prisma.transaction.findMany).toHaveBeenCalledWith(expect.objectContaining({
        where: expect.objectContaining({ date: { gte: new Date('2026-01-01'), lte: new Date('2026-01-31') } }),
      }));
    });
  });

  describe('getSummary', () => {
    it('should calculate summary correctly', async () => {
      prisma.user.findUnique.mockResolvedValue(createUser({ currency: 'EUR' }));
      prisma.transaction.findMany.mockResolvedValue([
        createTransaction({ type: 'INGRESO', amount: 500 }),
        createTransaction({ type: 'GASTO', amount: 200 }),
        createTransaction({ type: 'GASTO', amount: 100 }),
      ]);

      const result = await service.getSummary('user-1');
      
      expect(result.moneda).toBe('EUR');
      expect(result.total_ingresos).toBe(500);
      expect(result.total_gastos).toBe(300);
      expect(result.saldo).toBe(200);
    });

    it('should handle zero transactions', async () => {
      prisma.user.findUnique.mockResolvedValue(createUser());
      prisma.transaction.findMany.mockResolvedValue([]);

      const result = await service.getSummary('user-1');
      
      expect(result.saldo).toBe(0);
    });
  });

  describe('parseCsv', () => {
    it('should parse valid CSV', async () => {
      const csv = `monto,categoria,tipo,fecha\n100,comida,GASTO,2026-07-01`;
      const result = await service.parseCsv(csv);
      
      expect(result.valid_count).toBe(1);
      expect(result.error_count).toBe(0);
      expect(result.valid[0].monto).toBe(100);
    });

    it('should throw BadRequestException for invalid CSV structure', async () => {
      const csv = `"unclosed quote,monto\n100,comida`; // Bad CSV
      await expect(service.parseCsv(csv)).rejects.toThrow(BadRequestException);
    });

    it('should report errors for invalid rows', async () => {
      const csv = `monto,tipo\n-100,GASTO\n200,INVALIDO`;
      const result = await service.parseCsv(csv);
      
      expect(result.error_count).toBe(2);
      expect(result.errors[0].message).toContain('positivo');
      expect(result.errors[1].message).toContain('INGRESO o GASTO');
    });
  });

  describe('importCsv', () => {
    it('should import successfully', async () => {
      prisma.transaction.createMany.mockResolvedValue({ count: 5 });
      const result = await service.importCsv('user-1', [{} as any]);
      expect(result.imported).toBe(5);
    });
  });

  describe('remove', () => {
    it('should remove successfully', async () => {
      prisma.transaction.findUnique.mockResolvedValue(createTransaction({ userId: 'user-1' }));
      const result = await service.remove('tx-1', 'user-1');
      expect(result.deleted).toBe(true);
      expect(prisma.transaction.delete).toHaveBeenCalledWith({ where: { id: 'tx-1' } });
    });

    it('should throw NotFoundException if not exists', async () => {
      prisma.transaction.findUnique.mockResolvedValue(null);
      await expect(service.remove('tx-1', 'user-1')).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if belongs to other user', async () => {
      prisma.transaction.findUnique.mockResolvedValue(createTransaction({ userId: 'user-2' }));
      await expect(service.remove('tx-1', 'user-1')).rejects.toThrow(NotFoundException);
    });
  });
});
