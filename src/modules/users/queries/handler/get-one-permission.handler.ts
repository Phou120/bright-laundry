import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOnePermissionQuery } from '../get-one-permission.query';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { PermissionGroupOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/permission-group.orm';
import { HttpStatus, Inject } from '@nestjs/common';
import { READ_PERMISSION_REPOSITORY } from '@src/common/constants/inject-key';
import { IReadPermissionRepository } from '../../interfaces/permission.interface';
import { DomainException } from '@src/common/exceptions/domain.exception';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';

@QueryHandler(GetOnePermissionQuery)
export class GetOnePermissionQueryHandler
  implements
    IQueryHandler<
      GetOnePermissionQuery,
      ResponseResult<PermissionGroupOrmEntity>
    >
{
  constructor(
    @Inject(READ_PERMISSION_REPOSITORY)
    private readonly _read: IReadPermissionRepository,
  ) {}

  async execute(
    query: GetOnePermissionQuery,
  ): Promise<ResponseResult<PermissionGroupOrmEntity>> {
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
      PermissionGroupOrmEntity,
      { id: query.id },
      `${query.id}`,
    );
    return await this._read.getOne(query.id, query.manager);
  }
}
