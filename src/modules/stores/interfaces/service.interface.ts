import { StoreOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/store.orm';
import { UserOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/user.orm';
import { StoreUserOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/store-user.orm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { CreateStoreDto } from '../dtos/create.dto';
import { UpdateStoreDto } from '../dtos/update.dto';
import { StoreQueryDto } from '../dtos/query/query.dto';
import { EntityManager } from 'typeorm';

export interface IStoreServiceInterface {
  create(
    body: CreateStoreDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<StoreOrmEntity>>;

  createWithUser(
    body: CreateStoreDto,
    manager?: EntityManager,
  ): Promise<{
    store: StoreOrmEntity;
    user: UserOrmEntity | null;
    storeUser: StoreUserOrmEntity | null;
  }>;

  getAll(query: StoreQueryDto): Promise<ResponseResult<StoreOrmEntity>>;

  getOne(id: number): Promise<ResponseResult<StoreOrmEntity>>;

  update(
    id: number,
    body: UpdateStoreDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<StoreOrmEntity>>;

  delete(id: number, manager?: EntityManager): Promise<void>;

  uploadStoreLogo(
    file: Express.Multer.File,
    manager?: EntityManager,
  ): Promise<{ imageUrl: string }>;
}
