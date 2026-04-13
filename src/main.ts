import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  // 🔥 Swagger config
  const config = new DocumentBuilder()
    .setTitle('To-Do API')
    .setDescription('API para gestión de tareas')
    .setVersion('1.0')
    .addBearerAuth() // 👈 importante para JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // 👉 http://localhost:3000/api

  await app.listen(3000);
}
bootstrap();