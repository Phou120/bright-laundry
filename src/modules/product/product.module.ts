import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { productProviders } from './providers';
import { ProductController } from './controllers/product.controller';

@Module({
  imports: [CqrsModule],
  controllers: [ProductController],
  providers: [...productProviders],
  exports: [...productProviders],
})
export class ProductModule {}
