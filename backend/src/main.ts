import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();
  app.setGlobalPrefix('api');

  app.enableCors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:3000',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('AutoHub API')
    .setDescription('API da plataforma AutoHub')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const documentFactory = () =>
    SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs', app, documentFactory, {
    useGlobalPrefix: true,
  });

  await app.listen(process.env.PORT ?? 3001);
  console.log(`🚀 AutoHub API rodando em http://localhost:${process.env.PORT ?? 3001}/api`);
  console.log(`📄 Swagger disponível em http://localhost:${process.env.PORT ?? 3001}/api/docs`);
}

bootstrap();