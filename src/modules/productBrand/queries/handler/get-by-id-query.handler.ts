import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetByIdQuery } from '../get-by-id.query';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { ProductBrandOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/product-brand.orm';
import { HttpStatus, Inject } from '@nestjs/common';
import { READ_BRAND_REPOSITORY } from '@src/common/constants/inject-key';
import { IReadBrandRepository } from '../../interfaces/repository.interface';
import { DomainException } from '@src/common/exceptions/domain.exception';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';

@QueryHandler(GetByIdQuery)
export class GetByIdQueryHandler
  implements IQueryHandler<GetByIdQuery, ResponseResult<ProductBrandOrmEntity>>
{
  constructor(
    @Inject(READ_BRAND_REPOSITORY)
    private readonly _read: IReadBrandRepository,
  ) {}

  async execute(
    query: GetByIdQuery,
  ): Promise<ResponseResult<ProductBrandOrmEntity>> {
    if (isNaN(query.id)) {
      throw new DomainException(
        'errors.id_must_be_number',
        HttpStatus.BAD_REQUEST,
        { property: `id ${query.id}` },
      );
    }

    await findOneOrFail(
      query.manager,
      ProductBrandOrmEntity,
      { id: query.id },
      `id ${query.id}`,
    );
    return await this._read.getById(query.id, query.manager);
  }
}
