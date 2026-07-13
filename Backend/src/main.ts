import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const corsOrigins = process.env.CORS_ORIGINS;
  if (!corsOrigins?.trim()) {
    throw new Error(
      'CORS_ORIGINS es obligatoria. Define uno o más orígenes separados por comas.',
    );
  }

  const allowedOrigins = [
    ...new Set(
      corsOrigins
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean)
        .map((origin) => {
          const parsedOrigin = new URL(origin);
          if (!['http:', 'https:'].includes(parsedOrigin.protocol)) {
            throw new Error(`Origen CORS no válido: ${origin}`);
          }
          return parsedOrigin.origin;
        }),
    ),
  ];
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  );

  const port = Number(process.env.PORT);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('PORT es obligatoria y debe ser un puerto válido');
  }

  await app.listen(port);
}
bootstrap();
