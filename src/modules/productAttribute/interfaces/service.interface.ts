import { EntityManager } from 'typeorm';
import { CreateDto } from '../dtos/create/create.dto';
import { ProductAttributeOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/product-attribute.orm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { ProductAttributeQueryDto } from '../dtos/query/query.dto';
import { UpdateDto } from '../dtos/create/update.dto';

export interface IProductAttributeServiceInterface {
  create(
    dto: CreateDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<ProductAttributeOrmEntity>>;

  getAll(
    query: ProductAttributeQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<ProductAttributeOrmEntity>>;

  getById(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<ProductAttributeOrmEntity>>;

  update(
    id: number,
    dto: UpdateDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<ProductAttributeOrmEntity>>;

  delete(id: number, manager?: EntityManager): Promise<void>;
}
