import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 参数校验
  app.useGlobalPipes(new ValidationPipe());
  // 安全
  app.use(helmet());
  await app.listen(3000);
}
bootstrap();
