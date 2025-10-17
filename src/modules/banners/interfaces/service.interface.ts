import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { CreateDto } from '../dtos/create.dto';
import { BannerOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/banner.orm';
import { EntityManager } from 'typeorm';
import { BannerQueryDto } from '../dtos/query/query.dto';
import { UpdateDto } from '../dtos/update.dto';
import { UpdateOrderDto } from '../dtos/update-order.dto';

export interface IBannerServiceInterface {
  create(
    body: CreateDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<BannerOrmEntity>>;

  getAll(
    query: BannerQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<BannerOrmEntity>>;

  getById(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<BannerOrmEntity>>;

  update(
    id: number,
    body: UpdateDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<BannerOrmEntity>>;

  updateOrder(
    body: UpdateOrderDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<BannerOrmEntity[]>>;

  delete(id: number, manager?: EntityManager): Promise<void>;
}
