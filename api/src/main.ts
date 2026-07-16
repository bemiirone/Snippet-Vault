import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import express from 'express';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  if (process.env['NODE_ENV'] === 'production') {
    const expressInstance = app.getHttpAdapter().getInstance();
    const browserPath = path.join(__dirname, 'browser');

    expressInstance.use('/', expressInstance.static(browserPath));

    expressInstance.get('*', (_req: any, res: any) => {
      res.sendFile(path.join(browserPath, 'index.html'));
    });
  }

  const port = process.env['PORT'] || 3000;
  await app.listen(port);
}

bootstrap();
