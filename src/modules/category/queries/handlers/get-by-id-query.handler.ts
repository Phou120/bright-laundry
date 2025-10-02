import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetByIdQuery } from '../get-by-id.query';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { ProductCategoryOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/product-categoy.orm';
import { HttpStatus, Inject } from '@nestjs/common';
import { READ_CATEGORY_REPOSITORY } from '@src/common/constants/inject-key';
import { IReadCategoryRepository } from '../../interfaces/repository.interface';
import { DomainException } from '@src/common/exceptions/domain.exception';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';

@QueryHandler(GetByIdQuery)
export class GetByIdQueryHandler
  implements
    IQueryHandler<GetByIdQuery, ResponseResult<ProductCategoryOrmEntity>>
{
  constructor(
    @Inject(READ_CATEGORY_REPOSITORY)
    private readonly _read: IReadCategoryRepository,
  ) {}

  async execute(
    query: GetByIdQuery,
  ): Promise<ResponseResult<ProductCategoryOrmEntity>> {
    if (isNaN(query.id)) {
      throw new DomainException(
        'errors.id_must_be_number',
        HttpStatus.BAD_REQUEST,
        {
          property: `id ${query.id}`,
        },
      );
    }
    await findOneOrFail(
      query.manager,
      ProductCategoryOrmEntity,
      { id: query.id },
      `${query.id}`,
    );

    return await this._read.getById(query.id, query.manager);
  }
}
