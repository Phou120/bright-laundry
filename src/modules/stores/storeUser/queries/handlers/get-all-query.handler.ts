import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllStoreUserQuery } from '../get-all.query';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { StoreUserOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/store-user.orm';
import { HttpStatus, Inject } from '@nestjs/common';
import { READ_STORE_USER_REPOSITORY } from '@src/common/constants/inject-key';
import { IReadStoreUserRepository } from '../../interfaces/repository.interface';
import { DomainException } from '@src/common/exceptions/domain.exception';
import { UserOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/user.orm';

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
    // const store = await findOneOrFail(
    //   query.manager,
    //   StoreUserOrmEntity,
    //   { user_id: query.userId },
    //   `store id ${query.userId}`,
    // );

    // const store_id = store.store_id;

    // if (!store_id) {
    //   throw new DomainException('errors.not_found', HttpStatus.NOT_FOUND, {
    //     property: `${store_id}`,
    //   });
    // }

    const user = await query.manager.findOne(UserOrmEntity, {
      where: { id: query.userId },
      relations: ['roles'],
    });

    if (!user) {
      throw new DomainException('errors.not_found', HttpStatus.NOT_FOUND, {
        property: `${query.userId}`,
      });
    }

    const roles = user.roles?.map((r: any) => r.name) ?? [];

    console.log('object', roles);

    return await this._read.getAll(
      query.userId,
      query.query,
      query.manager,
      roles,
    );
  }
}
