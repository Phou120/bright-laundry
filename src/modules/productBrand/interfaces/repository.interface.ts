import { EntityManager } from 'typeorm';
import { CreateDto } from '../dtos/create.dto';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { ProductBrandOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/product-brand.orm';
import { ProductBrandQueryDto } from '../dtos/query/query.dto';

export interface IWriteProductBrandRepository {
  create(
    body: CreateDto,
    manager: EntityManager,
  ): Promise<ResponseResult<ProductBrandOrmEntity>>;
  //   update(
  //     id: number,
  //     body: UpdateDto,
  //     manager: EntityManager,
  //   ): Promise<ResponseResult<BannerOrmEntity>>;

  //   delete(id: number, manager: EntityManager): Promise<void>;
}

export interface IReadBrandRepository {
  getAll(
    query: ProductBrandQueryDto,
    manager: EntityManager,
  ): Promise<ResponseResult<ProductBrandOrmEntity>>;

  getById(
    id: number,
    manager: EntityManager,
  ): Promise<ResponseResult<ProductBrandOrmEntity>>;
}
