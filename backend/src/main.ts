import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:3000',
  });

  const config = new DocumentBuilder()
    .setTitle('AutoHub API')
    .setDescription('API da plataforma AutoHub')
    .setVersion('1.0')
    .build();

  const documentFactory = () =>
    SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, documentFactory, {
    useGlobalPrefix: true,
  });

  await app.listen(process.env.PORT ?? 3001);
}

bootstrap();