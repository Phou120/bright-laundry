import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllQuery } from '../get-all.query';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { ProductCategoryOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/product-categoy.orm';
import { Inject } from '@nestjs/common';
import { READ_CATEGORY_REPOSITORY } from '@src/common/constants/inject-key';
import { IReadCategoryRepository } from '../../interfaces/repository.interface';

@QueryHandler(GetAllQuery)
export class GetAllQueryHandler
  implements
    IQueryHandler<GetAllQuery, ResponseResult<ProductCategoryOrmEntity>>
{
  constructor(
    @Inject(READ_CATEGORY_REPOSITORY)
    private readonly _read: IReadCategoryRepository,
  ) {}

  async execute(
    query: GetAllQuery,
  ): Promise<ResponseResult<ProductCategoryOrmEntity>> {
    return await this._read.getAll(query.query, query.manager);
  }
}
