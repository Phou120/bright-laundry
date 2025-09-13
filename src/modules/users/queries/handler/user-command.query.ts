import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetAllUserQuery } from '../user.query';
import { READ_USER_REPOSITORY } from '@src/common/constants/inject-key';
import { Inject } from '@nestjs/common';
import { UserOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/user.orm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { IReadUserRepository } from '../../interfaces/repository.interface';

@QueryHandler(GetAllUserQuery)
export class GetAllUserQueryHandler
  implements IQueryHandler<GetAllUserQuery, ResponseResult<UserOrmEntity>>
{
  constructor(
    @Inject(READ_USER_REPOSITORY)
    private readonly _read: IReadUserRepository,
  ) {}

  async execute(
    query: GetAllUserQuery,
  ): Promise<ResponseResult<UserOrmEntity>> {
    return await this._read.getAll(query.query, query.manager);
  }
}
