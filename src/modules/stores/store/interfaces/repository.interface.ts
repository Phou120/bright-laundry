import { EntityManager } from 'typeorm';
import { CreateDto } from '../dtos/create/create.dto';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { StoreOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/store.orm';
import { StoreQueryDto } from '../dtos/query/query.dto';
import { UpdateDto } from '../dtos/create/update.dto';

export interface IWriteStoreRepository {
  create(
    body: CreateDto,
    tax_id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<StoreOrmEntity>>;

  update(
    id: number,
    body: UpdateDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<StoreOrmEntity>>;

  delete(id: number, manager?: EntityManager): Promise<void>;
}

export interface IReadStoreRepository {
  getAll(
    query: StoreQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<StoreOrmEntity>>;

  getById(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<StoreOrmEntity>>;
}
