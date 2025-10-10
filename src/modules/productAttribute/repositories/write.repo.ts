import { Injectable } from '@nestjs/common';
import { IWriteProductAttributeRepository } from '../interfaces/repository.interface';
import { ProductAttributeDataAccessMapper } from '../mappers/product-attribute.mapper';
import { CreateDto } from '../dtos/create/create.dto';
import { UpdateDto } from '../dtos/create/update.dto';
import { EntityManager } from 'typeorm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { ProductAttributeOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/product-attribute.orm';
import { OrmEntityMethod } from '@src/common/enums/orm-entity-method.enum';

@Injectable()
export class WriteProductAttributeRepository
  implements IWriteProductAttributeRepository
{
  constructor(
    private readonly _dataAccessMapper: ProductAttributeDataAccessMapper,
  ) {}

  async create(
    body: CreateDto,
    manager: EntityManager,
  ): Promise<ResponseResult<ProductAttributeOrmEntity>> {
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
  ): Promise<ResponseResult<ProductAttributeOrmEntity>> {
    const ormData = this._dataAccessMapper.toOrmEntity(
      body,
      OrmEntityMethod.UPDATE,
    );
    ormData.id = id;
    return this._dataAccessMapper.toEntity(await manager.save(ormData));
  }

  async delete(id: number, manager: EntityManager): Promise<void> {
    await manager.softDelete(ProductAttributeOrmEntity, id);
  }
}
