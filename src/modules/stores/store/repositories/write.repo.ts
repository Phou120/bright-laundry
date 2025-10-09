import { Injectable } from '@nestjs/common';
import { IWriteStoreRepository } from '../interfaces/repository.interface';
import { StoreDataAccessMapper } from '../mappers/store.mapper';
import { OrmEntityMethod } from '@src/common/enums/orm-entity-method.enum';
import { EntityManager } from 'typeorm';
import { CreateDto } from '../dtos/create/create.dto';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { StoreOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/store.orm';
import { UpdateDto } from '../dtos/create/update.dto';

@Injectable()
export class WriteStoreRepository implements IWriteStoreRepository {
  constructor(private readonly _dataAccessMapper: StoreDataAccessMapper) {}

  async create(
    body: CreateDto,
    tax_id: number,
    manager: EntityManager,
  ): Promise<ResponseResult<StoreOrmEntity>> {
    const ormData = this._dataAccessMapper.toOrmEntity(
      body,
      OrmEntityMethod.CREATE,
      tax_id,
    );
    return this._dataAccessMapper.toEntity(await manager.save(ormData));
  }

  async update(
    id: number,
    body: UpdateDto,
    manager: EntityManager,
  ): Promise<ResponseResult<StoreOrmEntity>> {
    const ormData = this._dataAccessMapper.toOrmEntity(
      body,
      OrmEntityMethod.UPDATE,
    );
    ormData.id = id;
    return this._dataAccessMapper.toEntity(await manager.save(ormData));
  }

  async delete(id: number, manager: EntityManager): Promise<void> {
    await manager.softDelete(StoreOrmEntity, { id });
  }

  async updateStatus(
    id: number,
    status_id: number,
    manager: EntityManager,
  ): Promise<ResponseResult<StoreOrmEntity>> {
    const ormData = new StoreOrmEntity();
    ormData.id = id;
    ormData.store_status_id = status_id;
    return this._dataAccessMapper.toEntity(await manager.save(ormData));
  }
}
