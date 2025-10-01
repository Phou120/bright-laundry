import { ProductCategoryOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/product-categoy.orm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { EntityManager } from 'typeorm';
import { CreateDto } from '../dtos/create/create.dto';

export interface IWriteCategoryRepository {
  create(
    body: CreateDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<ProductCategoryOrmEntity>>;
}
