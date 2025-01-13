import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { Logger } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';

  app.setGlobalPrefix(globalPrefix);
  app.use(cookieParser());
  app.enableCors({
    origin: '*',
    credentials: true,
  });

  const port = process.env.PORT || 3020;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
  );
}
bootstrap();
