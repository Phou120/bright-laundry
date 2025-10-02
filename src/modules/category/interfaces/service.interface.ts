import { EntityManager } from 'typeorm';
import { CreateDto } from '../dtos/create/create.dto';
import { UpdateDto } from '../dtos/create/update.dto';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { ProductCategoryOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/product-categoy.orm';
import { CategoryQueryDto } from '../dtos/query/query.dto';

export interface ICategoryServiceInterface {
  create(
    body: CreateDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<ProductCategoryOrmEntity>>;

  getAll(
    query: CategoryQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<ProductCategoryOrmEntity>>;

  getById(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<ProductCategoryOrmEntity>>;

  update(
    id: number,
    body: UpdateDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<ProductCategoryOrmEntity>>;

  delete(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<ProductCategoryOrmEntity>>;
}
