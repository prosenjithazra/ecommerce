import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { json, urlencoded } from 'express';
import { ValidationPipe } from '@nestjs/common';
import compression from 'compression';
import helmet from 'helmet';

async function bootstrap() {
  const isProd = process.env.NODE_ENV === 'production';
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
    logger: isProd ? ['warn', 'error'] : ['log', 'warn', 'error', 'debug'],
  });

  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(compression());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
      stopAtFirstError: true,
    }),
  );
  app.enableCors();
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ limit: '50mb', extended: true }));

  const configService = app.get(ConfigService);
  const port = Number(configService.get<string>('PORT') ?? 8000);

  const server = await app.listen(port);
  if (server && typeof server.setTimeout === 'function') {
    server.keepAliveTimeout = 65000;
    server.headersTimeout = 66000;
  }
  if (!isProd) {
    console.log(`[NestJS] Backend server successfully running on http://localhost:${port}`);
  }
}
void bootstrap();
