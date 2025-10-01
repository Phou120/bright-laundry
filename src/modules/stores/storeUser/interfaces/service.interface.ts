import { EntityManager } from 'typeorm';
import { CreateStoreUserDto } from '../dtos/create/create.dto';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { StoreUserOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/store-user.orm';
import { StoreUserQueryDto } from '../dtos/query/query.dto';
import { UpdateDto } from '../dtos/create/update.dto';

export interface IStoreUserServiceInterface {
  create(
    userId: number,
    dto: CreateStoreUserDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<StoreUserOrmEntity>>;

  getAll(
    userId: number,
    query: StoreUserQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<StoreUserOrmEntity>>;

  getById(
    userId: number,
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<StoreUserOrmEntity>>;

  update(
    id: number,
    dto: UpdateDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<StoreUserOrmEntity>>;

  delete(
    userId: number,
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<void>>;
}
