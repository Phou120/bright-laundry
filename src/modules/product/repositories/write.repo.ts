import { Injectable } from '@nestjs/common';
import { IWriteProductRepository } from '../interfaces/repository.interface';
import { ProductDataAccessMapper } from '../mappers/product.mapper';
import { EntityManager } from 'typeorm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { ProductOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/product.orm';
import { OrmEntityMethod } from '@src/common/enums/orm-entity-method.enum';

@Injectable()
export class WriteProductRepository implements IWriteProductRepository {
  constructor(
    private readonly _dataAccessMapper: ProductDataAccessMapper,
  ) {}

  async create(
    body: any,
    manager: EntityManager,
  ): Promise<ResponseResult<ProductOrmEntity>> {
    const ormData = this._dataAccessMapper.toOrmEntity(
      body,
      OrmEntityMethod.CREATE,
    );
    return this._dataAccessMapper.toEntity(await manager.save(ormData));
  }

  async update(
    id: number,
    body: any,
    manager: EntityManager,
  ): Promise<ResponseResult<ProductOrmEntity>> {
    const ormData = this._dataAccessMapper.toOrmEntity(
      body,
      OrmEntityMethod.UPDATE,
    );
    ormData.id = id;
    return this._dataAccessMapper.toEntity(await manager.save(ormData));
  }

  async delete(id: number, manager: EntityManager): Promise<void> {
    await manager.softDelete(ProductOrmEntity, id);
  }
}