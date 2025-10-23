import { TaxOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/tax.orm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { CreateTaxDto } from '../dtos/create.dto';
import { UpdateTaxDto } from '../dtos/update.dto';
import { TaxQueryDto } from '../dtos/query/query.dto';
import { EntityManager } from 'typeorm';

export interface ITaxServiceInterface {
  create(
    body: CreateTaxDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<TaxOrmEntity>>;

  getAll(query: TaxQueryDto): Promise<ResponseResult<TaxOrmEntity>>;

  getOne(id: number): Promise<ResponseResult<TaxOrmEntity>>;

  update(
    id: number,
    body: UpdateTaxDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<TaxOrmEntity>>;

  delete(id: number, manager?: EntityManager): Promise<void>;
}