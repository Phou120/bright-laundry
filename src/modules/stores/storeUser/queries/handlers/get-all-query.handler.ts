import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllStoreUserQuery } from '../get-all.query';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { StoreUserOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/store-user.orm';
import { HttpStatus, Inject } from '@nestjs/common';
import { READ_STORE_USER_REPOSITORY } from '@src/common/constants/inject-key';
import { IReadStoreUserRepository } from '../../interfaces/repository.interface';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { DomainException } from '@src/common/exceptions/domain.exception';

@QueryHandler(GetAllStoreUserQuery)
export class GetAllStoreUserQueryHandler
  implements
    IQueryHandler<GetAllStoreUserQuery, ResponseResult<StoreUserOrmEntity>>
{
  constructor(
    @Inject(READ_STORE_USER_REPOSITORY)
    private readonly _read: IReadStoreUserRepository,
  ) {}

  async execute(
    query: GetAllStoreUserQuery,
  ): Promise<ResponseResult<StoreUserOrmEntity>> {
    const store = await findOneOrFail(
      query.manager,
      StoreUserOrmEntity,
      { user_id: query.userId },
      `store id ${query.userId}`,
    );

    const store_id = store.store_id;

    if (!store_id) {
      throw new DomainException('errors.not_found', HttpStatus.NOT_FOUND, {
        property: `${store_id}`,
      });
    }
    return await this._read.getAll(
      query.userId,
      store_id,
      query.query,
      query.manager,
    );
  }
}
