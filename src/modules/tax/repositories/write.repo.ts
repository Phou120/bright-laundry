import { Injectable } from '@nestjs/common';
import { IWriteTaxRepository } from '../interfaces/repository.interface';
import { TaxDataAccessMapper } from '../mappers/tax.mapper';
import { EntityManager } from 'typeorm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { TaxOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/tax.orm';
import { OrmEntityMethod } from '@src/common/enums/orm-entity-method.enum';
import { UpdateDto } from '../dtos/create/update.dto';

@Injectable()
export class WriteTaxRepository implements IWriteTaxRepository {
  constructor(private readonly _dataAccessMapper: TaxDataAccessMapper) {}
  async update(
    id: number,
    body: UpdateDto,
    manager: EntityManager,
  ): Promise<ResponseResult<TaxOrmEntity>> {
    const ormData = this._dataAccessMapper.toOrmEntity(
      body,
      OrmEntityMethod.UPDATE,
    );
    ormData.id = id;
    return this._dataAccessMapper.toEntity(await manager.save(ormData));
  }
}
