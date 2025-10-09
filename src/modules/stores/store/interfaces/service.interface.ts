import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { CreateDto } from '../dtos/create/create.dto';
import { StoreOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/store.orm';
import { EntityManager } from 'typeorm';
import { StoreQueryDto } from '../dtos/query/query.dto';
import { UpdateDto } from '../dtos/create/update.dto';
import { UpdateStatusDto } from '../dtos/create/update-status.dto';

export interface IStoreServiceInterface {
  create(
    dto: CreateDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<StoreOrmEntity>>;

  getAll(
    query: StoreQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<StoreOrmEntity>>;

  getById(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<StoreOrmEntity>>;

  update(
    id: number,
    dto: UpdateDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<StoreOrmEntity>>;

  updateStatus(
    id: number,
    dto: UpdateStatusDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<StoreOrmEntity>>;

  delete(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<StoreOrmEntity>>;
}
