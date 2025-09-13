import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateRoleCommand } from '../update.command';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { RoleOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/role.orm';
import { WRITE_ROLE_REPOSITORY } from '@src/common/constants/inject-key';
import { Inject } from '@nestjs/common';
import { IWriteRoleRepository } from '@src/modules/users/interfaces/role.interface';
import { _checkColumnDuplicate } from '@src/common/utils/check-column-duplicate-orm.util';

@CommandHandler(UpdateRoleCommand)
export class UpdateRoleHandler
  implements ICommandHandler<UpdateRoleCommand, ResponseResult<RoleOrmEntity>>
{
  constructor(
    @Inject(WRITE_ROLE_REPOSITORY)
    private readonly _write: IWriteRoleRepository,
  ) {}

  async execute(
    command: UpdateRoleCommand,
  ): Promise<ResponseResult<RoleOrmEntity>> {
    await _checkColumnDuplicate(
      RoleOrmEntity,
      'name',
      command.body.name,
      command.manager,
      'errors.name_already_exists',
      command.id,
    );

    await _checkColumnDuplicate(
      RoleOrmEntity,
      'display_name',
      command.body.display_name,
      command.manager,
      'errors.display_name_already_exists',
      command.id,
    );

    const user = await this._write.update(
      command.id,
      command.body,
      command.manager,
    );
    return user;
  }
}
