import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOneRoleQuery } from '../get-one.query';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { RoleOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/role.orm';
import { READ_ROLE_REPOSITORY } from '@src/common/constants/inject-key';
import { HttpStatus, Inject } from '@nestjs/common';
import { IReadRoleRepository } from '@src/modules/users/interfaces/role.interface';
import { DomainException } from '@src/common/exceptions/domain.exception';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';

@QueryHandler(GetOneRoleQuery)
export class GetOneRoleQueryHandler
  implements IQueryHandler<GetOneRoleQuery, ResponseResult<RoleOrmEntity>>
{
  constructor(
    @Inject(READ_ROLE_REPOSITORY)
    private readonly _read: IReadRoleRepository,
  ) {}

  async execute(
    query: GetOneRoleQuery,
  ): Promise<ResponseResult<RoleOrmEntity>> {
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
      RoleOrmEntity,
      { id: query.id },
      `${query.id}`,
    );
    return await this._read.getOne(query.id, query.manager);
  }
}
