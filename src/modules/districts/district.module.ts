import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { DistrictController } from './controllers/district.controller';
import { districtProvider } from './providers';

@Module({
  imports: [CqrsModule],
  controllers: [DistrictController],
  providers: [...districtProvider],
  exports: [...districtProvider],
})
export class DistrictModule {}
