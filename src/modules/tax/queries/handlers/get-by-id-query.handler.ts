import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetByIdQuery } from '../get-by-id.query';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { TaxOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/tax.orm';
import { IReadTaxRepository } from '../../interfaces/repository.interface';
import { READ_TAX_REPOSITORY } from '@src/common/constants/inject-key';
import { HttpStatus, Inject } from '@nestjs/common';
import { DomainException } from '@src/common/exceptions/domain.exception';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';

@QueryHandler(GetByIdQuery)
export class GetByIdQueryHandler
  implements IQueryHandler<GetByIdQuery, ResponseResult<TaxOrmEntity>>
{
  constructor(
    @Inject(READ_TAX_REPOSITORY)
    private readonly _read: IReadTaxRepository,
  ) {}

  async execute(query: GetByIdQuery): Promise<ResponseResult<TaxOrmEntity>> {
    if (isNaN(query.id)) {
      throw new DomainException(
        'errors.id_must_be_number',
        HttpStatus.BAD_REQUEST,
        { property: `id ${query.id}` },
      );
    }

    await findOneOrFail(
      query.manager,
      TaxOrmEntity,
      { id: query.id },
      `id ${query.id}`,
    );
    return await this._read.getById(query.id, query.manager);
  }
}
