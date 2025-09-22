import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllQuery } from '../get-all.query';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { SupplierOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/supplier.orm';
import { READ_SUPPLIER_REPOSITORY } from '@src/common/constants/inject-key';
import { Inject } from '@nestjs/common';
import { IReadSupplierRepository } from '../../interfaces/repository.interface';

@QueryHandler(GetAllQuery)
export class GetAllQueryHandler
  implements IQueryHandler<GetAllQuery, ResponseResult<SupplierOrmEntity>>
{
  constructor(
    @Inject(READ_SUPPLIER_REPOSITORY)
    private readonly _read: IReadSupplierRepository,
  ) {}

  async execute(
    query: GetAllQuery,
  ): Promise<ResponseResult<SupplierOrmEntity>> {
    return await this._read.getAll(query.query, query.manager);
  }
}
