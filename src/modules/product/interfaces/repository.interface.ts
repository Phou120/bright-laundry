import { EntityManager } from 'typeorm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { ProductOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/product.orm';
import { ProductQueryDto } from '../dtos/query/query.dto';

export interface IWriteProductRepository {
  create(
    body: any,
    manager: EntityManager,
  ): Promise<ResponseResult<ProductOrmEntity>>;
  update(
    id: number,
    body: any,
    manager: EntityManager,
  ): Promise<ResponseResult<ProductOrmEntity>>;
  delete(id: number, manager: EntityManager): Promise<void>;
}

export interface IReadProductRepository {
  getAll(
    query: ProductQueryDto,
    manager: EntityManager,
  ): Promise<ResponseResult<ProductOrmEntity>>;
  getById(
    id: number,
    manager: EntityManager,
  ): Promise<ResponseResult<ProductOrmEntity>>;
}
