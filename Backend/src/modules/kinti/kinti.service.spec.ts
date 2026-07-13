import { Test, TestingModule } from '@nestjs/testing';
import { KintiService } from './kinti.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import mockPrismaService from '../../prisma/__mocks__/prisma.service';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('KintiService', () => {
  let service: KintiService;
  let prisma: typeof mockPrismaService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        KintiService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: ConfigService, useValue: { get: jest.fn().mockReturnValue('http://test-webhook') } },
      ],
    }).compile();

    service = module.get<KintiService>(KintiService);
    prisma = module.get(PrismaService) as typeof mockPrismaService;
    configService = module.get<ConfigService>(ConfigService);
    
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('sendMessageToAI', () => {
    it('should send text message successfully', async () => {
      const fetchMock = global.fetch as jest.Mock;
      fetchMock.mockResolvedValue({ ok: true, status: 200, json: jest.fn().mockResolvedValue({}) });

      await service.sendMessageToAI('user-1', 'hola');
      
      expect(fetchMock).toHaveBeenCalledWith('http://test-webhook', expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      }));
    });

    it('should send file successfully (multipart)', async () => {
      const fetchMock = global.fetch as jest.Mock;
      fetchMock.mockResolvedValue({ ok: true, status: 200, json: jest.fn().mockResolvedValue({}) });

      const file = { buffer: Buffer.from('test'), mimetype: 'text/csv', originalname: 'test.csv' } as Express.Multer.File;
      
      await service.sendMessageToAI('user-1', 'hola', file);
      
      expect(fetchMock).toHaveBeenCalledWith('http://test-webhook', expect.objectContaining({
        method: 'POST',
      }));
    });

    it('should throw HttpException if n8n responds with error', async () => {
      const fetchMock = global.fetch as jest.Mock;
      fetchMock.mockResolvedValue({ ok: false, status: 502, statusText: 'Bad Gateway' });

      await expect(service.sendMessageToAI('user-1', 'hola')).rejects.toThrow(HttpException);
    });

    it('should throw HttpException on network error', async () => {
      const fetchMock = global.fetch as jest.Mock;
      fetchMock.mockRejectedValue(new Error('Network error'));

      await expect(service.sendMessageToAI('user-1', 'hola')).rejects.toThrow(HttpException);
    });
  });

  describe('procesarCallbackN8n', () => {
    it('should insert movements and emit response', async () => {
      const dto = {
        usuario_id: 'user-1',
        origen: 'web',
        accion: 'GASTO',
        respuesta_chat: 'Gasto registrado',
        movimientos: [{ monto: 10, categoria: 'comida', fecha: '2026-07-12', tipo: 'GASTO' }],
      };

      await service.procesarCallbackN8n(dto);
      
      expect(prisma.$transaction).toHaveBeenCalled();
      const respuesta = service.obtenerRespuestaPendiente('user-1');
      expect(respuesta).toBe('Gasto registrado');
    });

    it('should only emit response if no movements', async () => {
      const dto = {
        usuario_id: 'user-1',
        origen: 'web',
        accion: 'FAQ',
        respuesta_chat: 'Kinti es gratis',
        movimientos: [],
      };

      await service.procesarCallbackN8n(dto);
      
      expect(prisma.$transaction).not.toHaveBeenCalled();
      const respuesta = service.obtenerRespuestaPendiente('user-1');
      expect(respuesta).toBe('Kinti es gratis');
    });

    it('should throw HttpException on db error', async () => {
      prisma.$transaction.mockRejectedValue(new Error('DB Error'));
      const dto = {
        usuario_id: 'user-1', origen: 'web', accion: 'GASTO', respuesta_chat: 'ok',
        movimientos: [{ monto: 10, categoria: 'comida', fecha: '2026-07-12', tipo: 'GASTO' }],
      };

      await expect(service.procesarCallbackN8n(dto)).rejects.toThrow(HttpException);
    });
  });

  describe('obtenerRespuestaPendiente', () => {
    it('should return null if no response', () => {
      expect(service.obtenerRespuestaPendiente('user-1')).toBeNull();
    });

    it('should return response and clear it', async () => {
      await service.procesarCallbackN8n({ usuario_id: 'user-1', respuesta_chat: 'hello' } as any);
      
      expect(service.obtenerRespuestaPendiente('user-1')).toBe('hello');
      expect(service.obtenerRespuestaPendiente('user-1')).toBeNull(); // Second read should be null
    });
  });
});
