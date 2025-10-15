import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetProductByIdQuery } from '../get-product-by-id.query';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { ProductOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/product.orm';
import { Inject } from '@nestjs/common';
import { READ_PRODUCT_REPOSITORY } from '@src/common/constants/inject-key';
import { IReadProductRepository } from '../../interfaces/repository.interface';

@QueryHandler(GetProductByIdQuery)
export class GetProductByIdQueryHandler
  implements
    IQueryHandler<GetProductByIdQuery, ResponseResult<ProductOrmEntity>>
{
  constructor(
    @Inject(READ_PRODUCT_REPOSITORY)
    private readonly _read: IReadProductRepository,
  ) {}

  async execute(
    query: GetProductByIdQuery,
  ): Promise<ResponseResult<ProductOrmEntity>> {
    return await this._read.getById(query.id, query.manager);
  }
}