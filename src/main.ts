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
import { ValidationPipe, INestApplication } from '@nestjs/common';
import { Request, Response } from 'express';

let nestApp: INestApplication | null = null;

async function bootstrap(): Promise<INestApplication> {
  if (!nestApp) {
    nestApp = await NestFactory.create(AppModule, {
      logger: ['error', 'warn'],
    });
    nestApp.enableCors();
    nestApp.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    await nestApp.init();
  }
  return nestApp;
}

export default async (req: Request, res: Response): Promise<void> => {
  const app = await bootstrap();
  app.getHttpAdapter().getInstance()(req, res);
};