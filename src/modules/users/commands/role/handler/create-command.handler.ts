import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateRoleCommand } from '../create.command';
import { WRITE_ROLE_REPOSITORY } from '@src/common/constants/inject-key';
import { Inject } from '@nestjs/common';
import { RoleOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/role.orm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { _checkColumnDuplicate } from '@src/common/utils/check-column-duplicate-orm.util';
import { IWriteRoleRepository } from '@src/modules/users/interfaces/role.interface';

@CommandHandler(CreateRoleCommand)
export class CreateRoleHandler
  implements ICommandHandler<CreateRoleCommand, ResponseResult<RoleOrmEntity>>
{
  constructor(
    @Inject(WRITE_ROLE_REPOSITORY)
    private readonly _write: IWriteRoleRepository,
  ) {}

  async execute(
    command: CreateRoleCommand,
  ): Promise<ResponseResult<RoleOrmEntity>> {
    await _checkColumnDuplicate(
      RoleOrmEntity,
      'name',
      command.body.name,
      command.manager,
      'errors.name_already_exists',
    );

    await _checkColumnDuplicate(
      RoleOrmEntity,
      'display_name',
      command.body.display_name,
      command.manager,
      'errors.display_name_already_exists',
    );

    const user = await this._write.create(command.body, command.manager);
    return user;
  }
}
