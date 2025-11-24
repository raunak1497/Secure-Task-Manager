import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { DataSource } from 'typeorm';
import { runSeed } from './seed/seed';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: "http://localhost:4000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });

  // -------------------------------------------
  // ⛳ Run SEED script before starting the server
  // -------------------------------------------
  const dataSource = app.get(DataSource);

  try {
    await runSeed(dataSource);
    console.log("🌱 Seed completed");
  } catch (err) {
    console.error("❌ Seed failed:", err);
  }

  await app.listen(3000);
  console.log("🚀 API running on http://localhost:3000");
}

bootstrap();