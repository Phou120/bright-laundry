import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { GetUserQuery } from '../get-user.query';
import { UserOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/user.orm';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { READ_USER_REPOSITORY } from '@src/common/constants/inject-key';
import { HttpStatus, Inject } from '@nestjs/common';
import { IReadUserRepository } from '../../interfaces/repository.interface';
import { DomainException } from '@src/common/exceptions/domain.exception';

@QueryHandler(GetUserQuery)
export class GetUserQueryHandler
  implements IQueryHandler<GetUserQuery, ResponseResult<UserOrmEntity>>
{
  constructor(
    @Inject(READ_USER_REPOSITORY)
    private readonly _read: IReadUserRepository,
  ) {}

  async execute(query: GetUserQuery): Promise<ResponseResult<UserOrmEntity>> {
    if (isNaN(query.id)) {
      throw new DomainException(
        'errors.id_must_be_number',
        HttpStatus.BAD_REQUEST,
        {
          property: `id ${query.id}`,
        },
      );
    }
    return await this._read.getUser(query.id);
  }
}
