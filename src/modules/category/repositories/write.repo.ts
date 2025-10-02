import { Injectable } from '@nestjs/common';
import { IWriteCategoryRepository } from '../interfaces/repository.interface';
import { CategoryDataAccessMapper } from '../mappers/category.mapper';
import { CreateDto } from '../dtos/create/create.dto';
import { UpdateDto } from '../dtos/create/update.dto';
import { EntityManager } from 'typeorm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { ProductCategoryOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/product-categoy.orm';
import { OrmEntityMethod } from '@src/common/enums/orm-entity-method.enum';

@Injectable()
export class WriteCategoryRepository implements IWriteCategoryRepository {
  constructor(private readonly _dataAccessMapper: CategoryDataAccessMapper) {}

  async create(
    body: CreateDto,
    manager: EntityManager,
  ): Promise<ResponseResult<ProductCategoryOrmEntity>> {
    const ormData = this._dataAccessMapper.toOrmEntity(
      body,
      OrmEntityMethod.CREATE,
    );
    return this._dataAccessMapper.toEntity(await manager.save(ormData));
  }

  async update(
    id: number,
    body: UpdateDto,
    manager: EntityManager,
  ): Promise<ResponseResult<ProductCategoryOrmEntity>> {
    const ormData = this._dataAccessMapper.toOrmEntity(
      body,
      OrmEntityMethod.UPDATE,
    );
    ormData.id = id;
    return this._dataAccessMapper.toEntity(await manager.save(ormData));
  }

  async delete(
    id: number,
    manager: EntityManager,
  ): Promise<ResponseResult<void>> {
    await manager.softDelete(ProductCategoryOrmEntity, id);
  }
}
