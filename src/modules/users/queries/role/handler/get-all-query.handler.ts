import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllRoleQuery } from '../get-all.query';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { Inject } from '@nestjs/common';
import { READ_ROLE_REPOSITORY } from '@src/common/constants/inject-key';
import { RoleOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/role.orm';
import { IReadRoleRepository } from '@src/modules/users/interfaces/role.interface';

@QueryHandler(GetAllRoleQuery)
export class GetAllRoleQueryHandler
  implements IQueryHandler<GetAllRoleQuery, ResponseResult<RoleOrmEntity>>
{
  constructor(
    @Inject(READ_ROLE_REPOSITORY)
    private readonly _read: IReadRoleRepository,
  ) {}

  async execute(
    query: GetAllRoleQuery,
  ): Promise<ResponseResult<RoleOrmEntity>> {
    return await this._read.getAll(query.query, query.manager);
  }
}
