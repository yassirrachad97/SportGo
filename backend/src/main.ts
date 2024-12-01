import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors({
     origin: ['http://localhost:5173'],  
    methods: 'GET,POST,PATCH,PUT,DELETE', 
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true, 
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  const PORT = process.env.PORT || 3000; 
  await app.listen(PORT, () => {
    console.log(`server running dans on ${PORT}`);
  });
}
bootstrap();

