import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllPermissionQuery } from '../get-all-permission.query';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { PermissionGroupOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/permission-group.orm';
import { Inject } from '@nestjs/common';
import { READ_PERMISSION_REPOSITORY } from '@src/common/constants/inject-key';
import { IReadPermissionRepository } from '../../interfaces/permission.interface';

@QueryHandler(GetAllPermissionQuery)
export class GetAllPermissionQueryHandler
  implements
    IQueryHandler<
      GetAllPermissionQuery,
      ResponseResult<PermissionGroupOrmEntity>
    >
{
  constructor(
    @Inject(READ_PERMISSION_REPOSITORY)
    private readonly _read: IReadPermissionRepository,
  ) {}

  async execute(
    query: GetAllPermissionQuery,
  ): Promise<ResponseResult<PermissionGroupOrmEntity>> {
    return await this._read.findAll(query.query, query.manager);
  }
}
