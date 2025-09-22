import { Injectable } from '@nestjs/common';
import { IWriteSupplierRepository } from '../interfaces/repository.interface';
import { SupplierDataAccessMapper } from '../mappers/supplier.mapper';
import { CreateDto } from '../dtos/create.dto';
import { EntityManager } from 'typeorm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { SupplierOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/supplier.orm';
import { OrmEntityMethod } from '@src/common/enums/orm-entity-method.enum';

@Injectable()
export class WriteSupplierRepository implements IWriteSupplierRepository {
  constructor(private readonly _dataAccessMapper: SupplierDataAccessMapper) {}

  async create(
    body: CreateDto,
    created_by: number,
    manager: EntityManager,
  ): Promise<ResponseResult<SupplierOrmEntity>> {
    const ormData = this._dataAccessMapper.toOrmEntity(
      body,
      OrmEntityMethod.CREATE,
      created_by,
    );
    return this._dataAccessMapper.toEntity(await manager.save(ormData));
  }

  async update(
    id: number,
    body: CreateDto,
    user_id: number,
    manager: EntityManager,
  ): Promise<ResponseResult<SupplierOrmEntity>> {
    const ormData = this._dataAccessMapper.toOrmEntity(
      body,
      OrmEntityMethod.UPDATE,
      user_id,
    );
    ormData.id = id;
    return this._dataAccessMapper.toEntity(await manager.save(ormData));
  }

  async delete(id: number, manager: EntityManager): Promise<void> {
    await manager.softDelete(SupplierOrmEntity, id);
  }
}
