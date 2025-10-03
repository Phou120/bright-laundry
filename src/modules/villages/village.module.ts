import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { VillageController } from './controllers/village.controller';
import { villageProvider } from './providers';

@Module({
  imports: [CqrsModule],
  controllers: [VillageController],
  providers: [...villageProvider],
  exports: [...villageProvider],
})
export class VillageModule {}
