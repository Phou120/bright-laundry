import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LogOutCommand } from '../logout.command';
import { HttpStatus, Inject } from '@nestjs/common';
import { READ_USER_REPOSITORY } from '@src/common/constants/inject-key';
import { IReadUserRepository } from '@src/modules/users/interfaces/repository.interface';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { UserOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/user.orm';
import { DomainException } from '@src/common/exceptions/domain.exception';

@CommandHandler(LogOutCommand)
export class LogOutHandler implements ICommandHandler<LogOutCommand, string> {
  constructor(
    @Inject(READ_USER_REPOSITORY)
    private readonly _read: IReadUserRepository,
  ) {}

  async execute(command: LogOutCommand): Promise<string> {
    const user = await findOneOrFail(
      command.manager,
      UserOrmEntity,
      {
        id: command.user_id,
      },
      `id: ${command.user_id}`,
    );

    if (user.access_token === null) {
      throw new DomainException(
        'errors.auth.login_first',
        HttpStatus.UNAUTHORIZED,
        'domain-error',
      );
    }

    await this._read.logout(command.user_id, command.manager);
    return 'Logout successfully';
  }
}
