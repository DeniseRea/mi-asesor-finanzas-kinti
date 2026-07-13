import { NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { KintiService } from './kinti.service';

describe('KintiService', () => {
  const config = { get: jest.fn() };
  const prisma = {
    aiRequest: {
      create: jest.fn(),
      update: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
  };
  const alerts = { onTransactionCreated: jest.fn() };
  const service = new KintiService(config as never, prisma as never, alerts as never);

  beforeEach(() => jest.clearAllMocks());

  it('rechaza mensajes cuando N8N_WEBHOOK_URL no está configurada', async () => {
    config.get.mockReturnValue(undefined);
    await expect(service.sendMessageToAI('user-1', 'hola')).rejects.toBeInstanceOf(ServiceUnavailableException);
    expect(prisma.aiRequest.create).not.toHaveBeenCalled();
  });

  it('impide consultar una respuesta perteneciente a otro usuario', async () => {
    prisma.aiRequest.findUnique.mockResolvedValue({ id: 'req-1', userId: 'user-2' });
    await expect(service.obtenerRespuesta('user-1', 'req-1')).rejects.toBeInstanceOf(NotFoundException);
  });

  it('devuelve el estado persistido sin consumir la respuesta', async () => {
    prisma.aiRequest.findUnique.mockResolvedValue({ id: 'req-1', userId: 'user-1', status: 'completed', responseText: 'listo', errorMessage: null });
    await expect(service.obtenerRespuesta('user-1', 'req-1')).resolves.toEqual({ requestId: 'req-1', status: 'completed', respuesta: 'listo', error: null });
    expect(prisma.aiRequest.findUnique).toHaveBeenCalledTimes(1);
  });
});
