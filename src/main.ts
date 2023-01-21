import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { config } from 'dotenv';
import { getAllowedCorsOrigins } from './utils/get-allowed-cors-origins';

config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: getAllowedCorsOrigins() });
  await app.listen(3000);
}
bootstrap();
