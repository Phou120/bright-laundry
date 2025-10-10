import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetByIdQuery } from '../get-by-id.query';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { ProductAttributeOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/product-attribute.orm';
import { Inject } from '@nestjs/common';
import { READ_PRODUCT_ATTRIBUTE_REPOSITORY } from '@src/common/constants/inject-key';
import { IReadProductAttributeRepository } from '../../interfaces/repository.interface';

@QueryHandler(GetByIdQuery)
export class GetByIdQueryHandler
  implements
    IQueryHandler<GetByIdQuery, ResponseResult<ProductAttributeOrmEntity>>
{
  constructor(
    @Inject(READ_PRODUCT_ATTRIBUTE_REPOSITORY)
    private readonly _read: IReadProductAttributeRepository,
  ) {}

  async execute(
    query: GetByIdQuery,
  ): Promise<ResponseResult<ProductAttributeOrmEntity>> {
    return await this._read.getById(query.id, query.manager);
  }
}