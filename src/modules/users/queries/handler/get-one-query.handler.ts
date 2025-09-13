import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOneUserQuery } from '../get-one.query';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { UserOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/user.orm';
import { HttpStatus, Inject } from '@nestjs/common';
import { READ_USER_REPOSITORY } from '@src/common/constants/inject-key';
import { IReadUserRepository } from '../../interfaces/repository.interface';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { DomainException } from '@src/common/exceptions/domain.exception';

@QueryHandler(GetOneUserQuery)
export class GetOneUserQueryHandler
  implements IQueryHandler<GetOneUserQuery, ResponseResult<UserOrmEntity>>
{
  constructor(
    @Inject(READ_USER_REPOSITORY)
    private readonly _read: IReadUserRepository,
  ) {}

  async execute(
    query: GetOneUserQuery,
  ): Promise<ResponseResult<UserOrmEntity>> {
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
      UserOrmEntity,
      { id: query.id },
      `${query.id}`,
    );
    return await this._read.getOne(query.id, query.manager);
  }
}
