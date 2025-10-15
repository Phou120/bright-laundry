import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetAllProductsQuery } from '../get-all-products.query';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { ProductOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/product.orm';
import { Inject } from '@nestjs/common';
import { READ_PRODUCT_REPOSITORY } from '@src/common/constants/inject-key';
import { IReadProductRepository } from '../../interfaces/repository.interface';

@QueryHandler(GetAllProductsQuery)
export class GetAllProductsQueryHandler
  implements
    IQueryHandler<GetAllProductsQuery, ResponseResult<ProductOrmEntity>>
{
  constructor(
    @Inject(READ_PRODUCT_REPOSITORY)
    private readonly _read: IReadProductRepository,
  ) {}

  async execute(
    query: GetAllProductsQuery,
  ): Promise<ResponseResult<ProductOrmEntity>> {
    return await this._read.getAll(query.query, query.manager);
  }
}