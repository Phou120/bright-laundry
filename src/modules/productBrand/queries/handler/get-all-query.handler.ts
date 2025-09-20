import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllQuery } from '../get-all.query';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { ProductBrandOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/product-brand.orm';
import { Inject } from '@nestjs/common';
import { READ_BRAND_REPOSITORY } from '@src/common/constants/inject-key';
import { IReadBrandRepository } from '../../interfaces/repository.interface';

@QueryHandler(GetAllQuery)
export class GetAllQueryHandler
  implements IQueryHandler<GetAllQuery, ResponseResult<ProductBrandOrmEntity>>
{
  constructor(
    @Inject(READ_BRAND_REPOSITORY)
    private readonly _read: IReadBrandRepository,
  ) {}

  async execute(
    query: GetAllQuery,
  ): Promise<ResponseResult<ProductBrandOrmEntity>> {
    return await this._read.getAll(query.query, query.manager);
  }
}
