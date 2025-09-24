import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { categoryProvider } from './providers';
import { CategoryController } from './controllers/category.controller';

@Module({
  imports: [CqrsModule],
  controllers: [CategoryController],
  providers: [...categoryProvider],
  exports: [...categoryProvider],
})
export class CategoryModule {}
