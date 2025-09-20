import { Injectable } from '@nestjs/common';
import { IWriteProductBrandRepository } from '../interfaces/repository.interface';
import { ProductBrandDataAccessMapper } from '../mappers/brand.mapper';
import { CreateDto } from '../dtos/create.dto';
import { EntityManager } from 'typeorm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { ProductBrandOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/product-brand.orm';
import { OrmEntityMethod } from '@src/common/enums/orm-entity-method.enum';

@Injectable()
export class WriteProductBrandRepository
  implements IWriteProductBrandRepository
{
  constructor(
    private readonly _dataAccessMapper: ProductBrandDataAccessMapper,
  ) {}

  async create(
    body: CreateDto,
    manager: EntityManager,
  ): Promise<ResponseResult<ProductBrandOrmEntity>> {
    const ormData = this._dataAccessMapper.toOrmEntity(
      body,
      OrmEntityMethod.CREATE,
    );
    return this._dataAccessMapper.toEntity(await manager.save(ormData));
  }

  async update(
    id: number,
    body: CreateDto,
    manager: EntityManager,
  ): Promise<ResponseResult<ProductBrandOrmEntity>> {
    const ormData = this._dataAccessMapper.toOrmEntity(
      body,
      OrmEntityMethod.UPDATE,
    );
    ormData.id = id;
    return this._dataAccessMapper.toEntity(await manager.save(ormData));
  }

  async delete(id: number, manager: EntityManager): Promise<void> {
    await manager.softDelete(ProductBrandOrmEntity, id);
  }
}
