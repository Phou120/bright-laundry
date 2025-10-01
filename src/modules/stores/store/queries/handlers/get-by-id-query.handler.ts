import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetByIdStoreQuery } from '../get-by-id.query';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { StoreOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/store.orm';
import { READ_STORE_REPOSITORY } from '@src/common/constants/inject-key';
import { HttpStatus, Inject } from '@nestjs/common';
import { IReadStoreRepository } from '../../interfaces/repository.interface';
import { DomainException } from '@src/common/exceptions/domain.exception';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';

@QueryHandler(GetByIdStoreQuery)
export class GetByIdStoreQueryHandler
  implements IQueryHandler<GetByIdStoreQuery, ResponseResult<StoreOrmEntity>>
{
  constructor(
    @Inject(READ_STORE_REPOSITORY)
    private readonly _read: IReadStoreRepository,
  ) {}

  async execute(
    query: GetByIdStoreQuery,
  ): Promise<ResponseResult<StoreOrmEntity>> {
    if (isNaN(query.id)) {
      throw new DomainException(
        'errors.id_must_be_number',
        HttpStatus.BAD_REQUEST,
        { property: `id ${query.id}` },
      );
    }
    await findOneOrFail(
      query.manager,
      StoreOrmEntity,
      { id: query.id },
      `${query.id}`,
    );
    return await this._read.getById(query.id, query.manager);
  }
}
