import { NestFactory } from '@nestjs/core';
import { TypeOrmRepositoryModule } from './typrorm.module';
import { SeederService } from './typeorms/seeders/services/seeder.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(
    TypeOrmRepositoryModule,
  );
  const seeder = app.get(SeederService);

  try {
    await seeder.seed();
  } catch (error) {
    console.log('error for notification seeder', error);
  }
  await app.close();
}

bootstrap().catch((error) => console.log('error seeding database: ', error));
