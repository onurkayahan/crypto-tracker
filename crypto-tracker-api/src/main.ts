import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import fastifyCors from '@fastify/cors';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  // Enable CORS
  await app.register(fastifyCors, {
    origin: ['*'], // Add specific trusted client origin
    methods: ['GET', 'POST'], // Allow only necessary HTTP methods
    credentials: true, // Enable if cookies or credentials are required
  });

  await app.listen(3000, '0.0.0.0');
}
bootstrap();
