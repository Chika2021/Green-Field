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

const server = express();

export const createNestServer = async (expressInstance: express.Express) => {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressInstance),
  );
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  await app.init();
  return app;
};

let cachedApp: any;

export default async (req: any, res: any) => {
  if (!cachedApp) {
    await createNestServer(server);
    cachedApp = server;
  }
  server(req, res);
};