import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { brandProvider } from './providers';
import { BrandController } from './controllers/brand.controller';

@Module({
  imports: [CqrsModule],
  controllers: [BrandController],
  providers: [...brandProvider],
  exports: [...brandProvider],
})
export class BrandModule {}
