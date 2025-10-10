import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetAllQuery } from '../get-all.query';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { ProductAttributeOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/product-attribute.orm';
import { Inject } from '@nestjs/common';
import { READ_PRODUCT_ATTRIBUTE_REPOSITORY } from '@src/common/constants/inject-key';
import { IReadProductAttributeRepository } from '../../interfaces/repository.interface';

@QueryHandler(GetAllQuery)
export class GetAllQueryHandler
  implements
    IQueryHandler<GetAllQuery, ResponseResult<ProductAttributeOrmEntity>>
{
  constructor(
    @Inject(READ_PRODUCT_ATTRIBUTE_REPOSITORY)
    private readonly _read: IReadProductAttributeRepository,
  ) {}

  async execute(
    query: GetAllQuery,
  ): Promise<ResponseResult<ProductAttributeOrmEntity>> {
    return await this._read.getAll(query.query, query.manager);
  }
}