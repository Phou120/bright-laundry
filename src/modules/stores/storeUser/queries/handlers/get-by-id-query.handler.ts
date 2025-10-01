import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetByIdStoreUserQuery } from '../get-by-id.query';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { StoreUserOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/store-user.orm';
import { READ_STORE_USER_REPOSITORY } from '@src/common/constants/inject-key';
import { HttpStatus, Inject } from '@nestjs/common';
import { IReadStoreUserRepository } from '../../interfaces/repository.interface';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { DomainException } from '@src/common/exceptions/domain.exception';

@QueryHandler(GetByIdStoreUserQuery)
export class GetByIdStoreUserQueryHandler
  implements
    IQueryHandler<GetByIdStoreUserQuery, ResponseResult<StoreUserOrmEntity>>
{
  constructor(
    @Inject(READ_STORE_USER_REPOSITORY)
    private readonly _read: IReadStoreUserRepository,
  ) {}

  async execute(
    query: GetByIdStoreUserQuery,
  ): Promise<ResponseResult<StoreUserOrmEntity>> {
    if (isNaN(query.id)) {
      throw new DomainException(
        'errors.id_must_be_number',
        HttpStatus.BAD_REQUEST,
        { property: `id ${query.id}` },
      );
    }

    const store_user = await findOneOrFail(
      query.manager,
      StoreUserOrmEntity,
      { id: query.id },
      `store id ${query.id}`,
    );

    const store = await findOneOrFail(
      query.manager,
      StoreUserOrmEntity,
      { user_id: query.userId },
      `store id ${query.userId}`,
    );

    const store_id = store.store_id;

    if (!store_id) {
      throw new DomainException('errors.not_found', HttpStatus.NOT_FOUND, {
        property: `${query.id}`,
      });
    }

    if (store_id !== store_user.store_id) {
      throw new DomainException('errors.not_found', HttpStatus.NOT_FOUND, {
        property: `${query.id}`,
      });
    }

    return await this._read.getById(query.id, query.manager);
  }
}
