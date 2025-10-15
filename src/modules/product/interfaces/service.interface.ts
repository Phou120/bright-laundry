import { EntityManager } from 'typeorm';
import { CreateProductDto } from '../dtos/create/create.dto';
import { ProductOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/product.orm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { UpdateProductDto } from '../dtos/create/update.dto';
import { ProductQueryDto } from '../dtos/query/query.dto';

export interface IProductServiceInterface {
  create(
    dto: CreateProductDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<ProductOrmEntity>>;

  getAll(
    query: ProductQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<ProductOrmEntity>>;

  getById(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<ProductOrmEntity>>;

  update(
    id: number,
    dto: UpdateProductDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<ProductOrmEntity>>;

  delete(id: number, manager?: EntityManager): Promise<void>;
}
