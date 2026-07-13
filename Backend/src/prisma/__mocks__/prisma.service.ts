import { PrismaService } from '../prisma.service';

const mockPrismaService = {
  user: {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    deleteMany: jest.fn(),
  },
  transaction: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    createMany: jest.fn(),
    aggregate: jest.fn(),
    delete: jest.fn(),
  },
  budget: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  alert: {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  ticket: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
  },
  ticketMessage: {
    create: jest.fn(),
  },
  knowledgeBase: {
    findMany: jest.fn(),
    create: jest.fn(),
  },
  revokedToken: {
    findUnique: jest.fn(),
    create: jest.fn(),
    deleteMany: jest.fn(),
  },
  $transaction: jest.fn((cb: any) => cb(mockPrismaService)),
  $connect: jest.fn(),
  $disconnect: jest.fn(),
} as unknown as jest.Mocked<PrismaService>;

export default mockPrismaService;
