import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { UpdateDto } from '../dtos/create/update.dto';
import { TaxOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/tax.orm';
import { EntityManager } from 'typeorm';
import { TaxQueryDto } from '../dtos/query/query.dto';

export interface ITaxServiceInterface {
  update(
    id: number,
    body: UpdateDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<TaxOrmEntity>>;

  findAll(
    query: TaxQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<TaxOrmEntity>>;

  findOne(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<TaxOrmEntity>>;
}
