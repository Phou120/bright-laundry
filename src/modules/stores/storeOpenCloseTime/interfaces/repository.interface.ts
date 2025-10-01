import { StoreOpenCloseTimeOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/store-open-close-time.orm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { EntityManager } from 'typeorm';
import { CreateDto } from '../../store/dtos/create/create.dto';
import { UpdateDto } from '../../store/dtos/create/update.dto';

export interface IWriteOpenCloseStoreRepository {
  create(
    store_id: number,
    body: CreateDto,
    manager: EntityManager,
  ): Promise<ResponseResult<StoreOpenCloseTimeOrmEntity>>;

  update(
    id: number,
    body: UpdateDto,
    manager: EntityManager,
  ): Promise<ResponseResult<StoreOpenCloseTimeOrmEntity>>;
}
