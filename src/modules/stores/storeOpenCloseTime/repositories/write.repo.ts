import { Injectable } from '@nestjs/common';
import { StoreOpenCloseTimeDataAccessMapper } from '../mappers/store-open-close-time.mapper';
import { IWriteOpenCloseStoreRepository } from '../interfaces/repository.interface';
import { CreateDto } from '../../store/dtos/create/create.dto';
import { EntityManager } from 'typeorm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { OrmEntityMethod } from '@src/common/enums/orm-entity-method.enum';
import { StoreOpenCloseTimeOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/store-open-close-time.orm';
import { UpdateDto } from '../../store/dtos/create/update.dto';

@Injectable()
export class WriteStoreOpenCloseTimeRepository
  implements IWriteOpenCloseStoreRepository
{
  constructor(
    private readonly _dataAccessMapper: StoreOpenCloseTimeDataAccessMapper,
  ) {}

  async create(
    store_id: number,
    body: CreateDto,
    manager: EntityManager,
  ): Promise<ResponseResult<StoreOpenCloseTimeOrmEntity>> {
    const ormData = this._dataAccessMapper.toOrmEntity(
      store_id,
      body,
      OrmEntityMethod.CREATE,
    );
    return this._dataAccessMapper.toEntity(await manager.save(ormData));
  }

  async update(
    id: number,
    body: UpdateDto,
    manager: EntityManager,
  ): Promise<ResponseResult<StoreOpenCloseTimeOrmEntity>> {
    const ormData = this._dataAccessMapper.toOrmEntity(
      id,
      body,
      OrmEntityMethod.UPDATE,
    );
    ormData.id = id;
    return this._dataAccessMapper.toEntity(await manager.save(ormData));
  }
}
