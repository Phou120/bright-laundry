import { StoreOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/store.orm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { CreateStoreAndUserDto, CreateUserStoreDto } from '../dtos/create.dto';
import { UpdateStoreDto } from '../dtos/update.dto';
import { StoreQueryDto } from '../dtos/query/query.dto';
import { EntityManager } from 'typeorm';
import { UserOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/user.orm';

export interface IStoreServiceInterface {
  create(
    body: CreateStoreAndUserDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<StoreOrmEntity>>;

  createWithUser(
    userId: number,
    body: CreateUserStoreDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<UserOrmEntity>>;

  getAll(query: StoreQueryDto): Promise<ResponseResult<StoreOrmEntity>>;

  getAllUser(
    userId: number,
    query: StoreQueryDto,
  ): Promise<ResponseResult<UserOrmEntity>>;

  getOne(id: number): Promise<ResponseResult<StoreOrmEntity>>;

  update(
    id: number,
    body: UpdateStoreDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<StoreOrmEntity>>;

  delete(id: number, manager?: EntityManager): Promise<void>;

  deleteUser(id: number, manager?: EntityManager): Promise<void>;

  uploadStoreLogo(
    file: Express.Multer.File,
    manager?: EntityManager,
  ): Promise<{ imageUrl: string }>;
}
