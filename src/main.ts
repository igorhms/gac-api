import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MongoAdapterInterceptor } from './interceptors/mongo-adapter.interceptor';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new MongoAdapterInterceptor());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
