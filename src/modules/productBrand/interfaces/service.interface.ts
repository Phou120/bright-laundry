import { EntityManager } from 'typeorm';
import { CreateDto } from '../dtos/create.dto';
import { ProductBrandOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/product-brand.orm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { ProductBrandQueryDto } from '../dtos/query/query.dto';
import { UpdateDto } from '../dtos/update.dto';

export interface IBrandServiceInterface {
  create(
    dto: CreateDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<ProductBrandOrmEntity>>;

  getAll(
    query: ProductBrandQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<ProductBrandOrmEntity>>;

  getById(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<ProductBrandOrmEntity>>;

  update(
    id: number,
    dto: UpdateDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<ProductBrandOrmEntity>>;
}
