import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { GetByIdQuery } from '../get-by-id.query';
import { SupplierOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/supplier.orm';
import { HttpStatus, Inject } from '@nestjs/common';
import { READ_SUPPLIER_REPOSITORY } from '@src/common/constants/inject-key';
import { IReadSupplierRepository } from '../../interfaces/repository.interface';
import { DomainException } from '@src/common/exceptions/domain.exception';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';

@QueryHandler(GetByIdQuery)
export class GetByIdQueryHandler
  implements IQueryHandler<GetByIdQuery, ResponseResult<SupplierOrmEntity>>
{
  constructor(
    @Inject(READ_SUPPLIER_REPOSITORY)
    private readonly _read: IReadSupplierRepository,
  ) {}

  async execute(
    query: GetByIdQuery,
  ): Promise<ResponseResult<SupplierOrmEntity>> {
    if (isNaN(query.id)) {
      throw new DomainException(
        'errors.id_must_be_number',
        HttpStatus.BAD_REQUEST,
        { property: `id ${query.id}` },
      );
    }
    await findOneOrFail(
      query.manager,
      SupplierOrmEntity,
      {
        id: query.id,
      },
      `${query.id}`,
    );
    return await this._read.getById(query.id, query.manager);
  }
}
