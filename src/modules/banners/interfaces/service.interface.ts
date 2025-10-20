import { BannerOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/banner.orm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { CreateBannerDto } from '../dtos/create.dto';
import { UpdateBannerDto } from '../dtos/update.dto';
import { BannerQueryDto } from '../dtos/query/query.dto';
import { EntityManager } from 'typeorm';

export interface IBannerServiceInterface {
  create(
    body: CreateBannerDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<BannerOrmEntity>>;

  getAll(
    query: BannerQueryDto,
  ): Promise<ResponseResult<BannerOrmEntity>>;

  getOne(
    id: number,
  ): Promise<ResponseResult<BannerOrmEntity>>;

  update(
    id: number,
    body: UpdateBannerDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<BannerOrmEntity>>;

  delete(
    id: number,
    manager?: EntityManager,
  ): Promise<void>;

  uploadFile(
    file: Express.Multer.File,
    manager?: EntityManager,
  ): Promise<{ imageUrl: string }>;
}