import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllStoreQuery } from '../get-all.query';
import { StoreOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/store.orm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { READ_STORE_REPOSITORY } from '@src/common/constants/inject-key';
import { Inject } from '@nestjs/common';
import { IReadStoreRepository } from '../../interfaces/repository.interface';

@QueryHandler(GetAllStoreQuery)
export class GetAllStoreQueryHandler
  implements IQueryHandler<GetAllStoreQuery, ResponseResult<StoreOrmEntity>>
{
  constructor(
    @Inject(READ_STORE_REPOSITORY)
    private readonly _read: IReadStoreRepository,
  ) {}

  async execute(
    query: GetAllStoreQuery,
  ): Promise<ResponseResult<StoreOrmEntity>> {
    return await this._read.getAll(query.query, query.manager);
  }
}
