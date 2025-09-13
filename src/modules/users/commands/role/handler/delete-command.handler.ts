import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteRoleCommand } from '../delete.command';
import { WRITE_ROLE_REPOSITORY } from '@src/common/constants/inject-key';
import { HttpStatus, Inject } from '@nestjs/common';
import { IWriteRoleRepository } from '@src/modules/users/interfaces/role.interface';
import { DomainException } from '@src/common/exceptions/domain.exception';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { RoleOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/role.orm';

@CommandHandler(DeleteRoleCommand)
export class DeleteRoleHandler
  implements ICommandHandler<DeleteRoleCommand, void>
{
  constructor(
    @Inject(WRITE_ROLE_REPOSITORY)
    private readonly _write: IWriteRoleRepository,
  ) {}

  async execute(command: DeleteRoleCommand): Promise<void> {
    if (isNaN(command.id)) {
      throw new DomainException(
        'errors.id_must_be_number',
        HttpStatus.BAD_REQUEST,
        {
          property: `id ${command.id}`,
        },
      );
    }
    await findOneOrFail(
      command.manager,
      RoleOrmEntity,
      { id: command.id },
      `${command.id}`,
    );
    return await this._write.delete(command.id, command.manager);
  }
}
