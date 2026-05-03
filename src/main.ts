import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import express, { Request, Response } from 'express';

const expressApp = express();
let app: any;

async function bootstrap() {
  if (!app) {
    app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressApp),
    );

    app.enableCors({
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    });

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
  }
  return app;
}

// Local development
if (process.env.NODE_ENV !== 'production') {
  bootstrap().then(async () => {
    await app.listen(process.env.PORT ?? 3000);
    console.log(
      `Running on http://localhost:${process.env.PORT ?? 3000}`,
    );
  });
}

// Vercel serverless handler
export default async (req: Request, res: Response) => {
  await bootstrap();
  expressApp(req, res);
};