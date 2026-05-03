// import { NestFactory } from '@nestjs/core';
// import { ValidationPipe } from '@nestjs/common';
// import { AppModule } from './app.module';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   app.enableCors();
//   app.useGlobalPipes(new ValidationPipe());
//   await app.listen(process.env.PORT ?? 5000);
// }
// bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import express from 'express';
import { Express } from 'express';
import { INestApplication } from '@nestjs/common';

const expressApp: Express = express();
let nestApp: INestApplication | null = null;

async function bootstrap(): Promise<Express> {
  if (!nestApp) {
    nestApp = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressApp),
      { logger: ['error', 'warn'] },
    );
    nestApp.enableCors();
    nestApp.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    await nestApp.init();
  }
  return expressApp;
}

export default async (req: any, res: any) => {
  const app = await bootstrap();
  app(req, res);
};