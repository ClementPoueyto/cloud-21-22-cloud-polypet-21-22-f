import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = Number(process.env.PORT )|| 8084;
  app.enableCors()
  await app.listen(PORT);
}
bootstrap();
