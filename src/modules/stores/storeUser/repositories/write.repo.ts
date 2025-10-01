import { Injectable } from '@nestjs/common';
import { IWriteStoreUserRepository } from '../interfaces/repository.interface';
import { StoreUserDataAccessMapper } from '../mappers/store-user.mapper';
import { EntityManager } from 'typeorm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { StoreUserOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/store-user.orm';
import { OrmEntityMethod } from '@src/common/enums/orm-entity-method.enum';

@Injectable()
export class WriteStoreUserRepository implements IWriteStoreUserRepository {
  constructor(private readonly _dataAccessMapper: StoreUserDataAccessMapper) {}

  async create(
    user_id: number,
    store_id: number,
    manager: EntityManager,
  ): Promise<ResponseResult<StoreUserOrmEntity>> {
    const ormData = this._dataAccessMapper.toOrmEntity(
      store_id,
      user_id,
      OrmEntityMethod.CREATE,
    );
    const result = this._dataAccessMapper.toEntity(await manager.save(ormData));
    return result;
  }

  async delete(id: number, manager: EntityManager): Promise<void> {
    await manager.softDelete(StoreUserOrmEntity, { id });
  }
}
