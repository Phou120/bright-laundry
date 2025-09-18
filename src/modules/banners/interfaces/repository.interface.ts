import { EntityManager } from 'typeorm';
import { CreateDto } from '../dtos/create.dto';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { BannerOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/banner.orm';
import { BannerQueryDto } from '../dtos/query/query.dto';
import { UpdateDto } from '../dtos/update.dto';

export interface IWriteBannerRepository {
  create(
    body: CreateDto,
    manager: EntityManager,
  ): Promise<ResponseResult<BannerOrmEntity>>;
  update(
    id: number,
    body: UpdateDto,
    manager: EntityManager,
  ): Promise<ResponseResult<BannerOrmEntity>>;

  delete(id: number, manager: EntityManager): Promise<void>;
}

export interface IReadBannerRepository {
  getAll(
    query: BannerQueryDto,
    manager: EntityManager,
  ): Promise<ResponseResult<BannerOrmEntity>>;

  getById(
    id: number,
    manager: EntityManager,
  ): Promise<ResponseResult<BannerOrmEntity>>;
}
