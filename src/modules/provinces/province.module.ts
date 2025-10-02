import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ProvinceController } from './controllers/province.controller';
import { provinceProvider } from './providers';

@Module({
  imports: [CqrsModule],
  controllers: [ProvinceController],
  providers: [...provinceProvider],
  exports: [...provinceProvider],
})
export class ProvinceModule {}
