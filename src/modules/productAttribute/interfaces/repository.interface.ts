import { EntityManager } from 'typeorm';
import { CreateDto } from '../dtos/create/create.dto';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { ProductAttributeOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/product-attribute.orm';
import { ProductAttributeQueryDto } from '../dtos/query/query.dto';
import { UpdateDto } from '../dtos/create/update.dto';

export interface IWriteProductAttributeRepository {
  create(
    body: CreateDto,
    manager: EntityManager,
  ): Promise<ResponseResult<ProductAttributeOrmEntity>>;
  update(
    id: number,
    body: UpdateDto,
    manager: EntityManager,
  ): Promise<ResponseResult<ProductAttributeOrmEntity>>;

  delete(id: number, manager: EntityManager): Promise<void>;
}

export interface IReadProductAttributeRepository {
  getAll(
    query: ProductAttributeQueryDto,
    manager: EntityManager,
  ): Promise<ResponseResult<ProductAttributeOrmEntity>>;

  getById(
    id: number,
    manager: EntityManager,
  ): Promise<ResponseResult<ProductAttributeOrmEntity>>;
}
