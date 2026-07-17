import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import express from 'express';
import * as path from 'path';

let cachedServer: express.Express | null = null;

async function bootstrap() {
  if (cachedServer) {
    return cachedServer;
  }

  const expressApp = express();
  const adapter = new ExpressAdapter(expressApp);
  const app = await NestFactory.create(AppModule, adapter);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const browserPath = path.join(process.cwd(), 'api', 'dist', 'browser');
  expressApp.use(express.static(browserPath));

  expressApp.get('*', (req: any, res: any) => {
    res.sendFile(path.join(browserPath, 'index.html'));
  });

  await app.init();

  cachedServer = expressApp;
  return expressApp;
}

export default async function handler(req: any, res: any) {
  const server = await bootstrap();
  server(req, res);
}
