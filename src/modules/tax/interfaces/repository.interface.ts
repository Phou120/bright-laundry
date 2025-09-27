import { EntityManager } from 'typeorm';
import { UpdateDto } from '../dtos/create/update.dto';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { TaxOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/tax.orm';
import { TaxQueryDto } from '../dtos/query/query.dto';

export interface IWriteTaxRepository {
  update(
    id: number,
    body: UpdateDto,
    manager: EntityManager,
  ): Promise<ResponseResult<TaxOrmEntity>>;
}

export interface IReadTaxRepository {
  findAll(
    query: TaxQueryDto,
    manager: EntityManager,
  ): Promise<ResponseResult<TaxOrmEntity>>;

  getById(
    id: number,
    manager: EntityManager,
  ): Promise<ResponseResult<TaxOrmEntity>>;
}
