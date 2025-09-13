import { WRITE_USER_REPOSITORY } from '@src/common/constants/inject-key';
import { deleteCommand } from '../delete.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IWriteUserRepository } from '../../interfaces/repository.interface';
import { HttpStatus, Inject } from '@nestjs/common';
import { DomainException } from '@src/common/exceptions/domain.exception';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { UserOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/user.orm';

@CommandHandler(deleteCommand)
export class DeleteHandler implements ICommandHandler<deleteCommand, void> {
  constructor(
    @Inject(WRITE_USER_REPOSITORY)
    private readonly _write: IWriteUserRepository,
  ) {}

  async execute(command: deleteCommand): Promise<void> {
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
      UserOrmEntity,
      { id: command.id },
      `${command.id}`,
    );
    return await this._write.delete(command.id, command.manager);
  }
}
