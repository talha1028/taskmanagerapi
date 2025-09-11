import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // remove extra properties
    forbidNonWhitelisted: true, // throw error if unknown fields
    transform: true, // auto-transform payloads to DTOs
  }));

  // Swagger Config
  const config = new DocumentBuilder()
    .setTitle('Task Manager API')
    .setDescription('API for managing tasks')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'access-token', // must match @ApiBearerAuth('access-token') in controllers
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: { persistAuthorization: true }, // ✅ keeps you logged in after reload
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
