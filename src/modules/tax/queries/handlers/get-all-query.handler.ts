import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllTaxQuery } from '../get-all.query';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { READ_TAX_REPOSITORY } from '@src/common/constants/inject-key';
import { Inject } from '@nestjs/common';
import { TaxOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/tax.orm';
import { IReadTaxRepository } from '../../interfaces/repository.interface';

@QueryHandler(GetAllTaxQuery)
export class GetAllTaxQueryHandler
  implements IQueryHandler<GetAllTaxQuery, ResponseResult<TaxOrmEntity>>
{
  constructor(
    @Inject(READ_TAX_REPOSITORY)
    private readonly _read: IReadTaxRepository,
  ) {}

  async execute(query: GetAllTaxQuery): Promise<ResponseResult<TaxOrmEntity>> {
    return await this._read.findAll(query.query, query.manager);
  }
}
