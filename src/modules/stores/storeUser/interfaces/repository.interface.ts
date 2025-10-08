import { StoreUserOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/store-user.orm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { EntityManager } from 'typeorm';
import { StoreUserQueryDto } from '../dtos/query/query.dto';

export interface IWriteStoreUserRepository {
  create(
    user_id: number,
    store_id: number,
    manager: EntityManager,
  ): Promise<ResponseResult<StoreUserOrmEntity>>;

  delete(id: number, manager: EntityManager): Promise<void>;
}

export interface IReadStoreUserRepository {
  getAll(
    userId: number,
    query: StoreUserQueryDto,
    manager?: EntityManager,
    roles?: string[],
  ): Promise<ResponseResult<StoreUserOrmEntity>>;

  getById(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<StoreUserOrmEntity>>;
}
