import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import mockPrismaService from '../src/prisma/__mocks__/prisma.service';
import { JwtService } from '@nestjs/jwt';

// Mock Firebase entirely to prevent errors when Firebase env vars are missing
jest.mock('firebase-admin/app', () => ({
  initializeApp: jest.fn().mockReturnValue({}),
  cert: jest.fn(),
}));

jest.mock('firebase-admin/auth', () => ({
  getAuth: jest.fn().mockReturnValue({
    verifyIdToken: jest.fn(),
  }),
}));

describe('Kinti API (e2e)', () => {
  let app: INestApplication;
  let jwtToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrismaService)
      .compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
    await app.init();

    // Generate a valid JWT token for auth routes testing
    const jwtService = moduleFixture.get<JwtService>(JwtService);
    jwtToken = jwtService.sign({ sub: 'user-1', email: 'test@test.com', jti: 'fake-jti' }, { secret: process.env.JWT_SECRET || 'kinti-hackathon-2026-secret-key' });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Auth Module', () => {
    it('/api/auth/register (POST)', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue({ id: 'user-1', name: 'Test', email: 'test@test.com' } as any);

      return request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          name: 'Test',
          email: 'test@test.com',
          password: 'Password123!',
          confirmPassword: 'Password123!',
        })
        .expect(201);
    });

    it('/api/auth/profile (GET) - Protected', async () => {
      mockPrismaService.revokedToken.findUnique.mockResolvedValue(null);
      mockPrismaService.user.findUnique.mockResolvedValue({ id: 'user-1', name: 'Test' } as any);

      return request(app.getHttpServer())
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200);
    });

    it('/api/auth/profile (GET) - Unauthorized', async () => {
      return request(app.getHttpServer())
        .get('/api/auth/profile')
        .expect(401);
    });
  });

  describe('Transactions Module', () => {
    it('/api/transactions (POST)', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({ id: 'user-1' } as any);
      mockPrismaService.transaction.create.mockResolvedValue({ id: 'tx-1', date: new Date(), createdAt: new Date() } as any);

      return request(app.getHttpServer())
        .post('/api/transactions')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({
          monto: 100,
          accion: 'GASTO',
          categoria: 'comida',
        })
        .expect(201);
    });

    it('/api/transactions (GET)', async () => {
      mockPrismaService.transaction.findMany.mockResolvedValue([]);

      return request(app.getHttpServer())
        .get('/api/transactions')
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200);
    });
  });

  describe('Budgets Module', () => {
    it('/api/budgets (POST)', async () => {
      mockPrismaService.budget.create.mockResolvedValue({ id: 'b-1' } as any);

      return request(app.getHttpServer())
        .post('/api/budgets')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({
          category: 'comida',
          amount: 500,
          month: 7,
          year: 2026,
        })
        .expect(201);
    });
  });

  describe('Kinti Webhook', () => {
    it('/api/kinti-webhook (POST)', async () => {
      process.env.N8N_WEBHOOK_SECRET = 'secret';
      
      return request(app.getHttpServer())
        .post('/api/kinti-webhook')
        .set('x-kinti-secret', 'secret')
        .send({
          usuario_id: 'user-1',
          origen: 'web',
          accion: 'GASTO',
          movimientos: [],
          respuesta_chat: 'hola',
        })
        .expect(200);
    });
  });
});
