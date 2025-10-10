import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { productAttributeProvider } from './providers';
import { ProductAttributeController } from './controllers/product-attribute.controller';

@Module({
  imports: [CqrsModule],
  controllers: [ProductAttributeController],
  providers: [...productAttributeProvider],
  exports: [...productAttributeProvider],
})
export class ProductAttributeModule {}