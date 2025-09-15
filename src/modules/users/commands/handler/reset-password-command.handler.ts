import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ResetPasswordCommand } from '../reset-password.command';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { UserOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/user.orm';
import { WRITE_USER_REPOSITORY } from '@src/common/constants/inject-key';
import { Inject } from '@nestjs/common';
import { IWriteUserRepository } from '../../interfaces/repository.interface';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';

@CommandHandler(ResetPasswordCommand)
export class ResetPasswordHandler
  implements
    ICommandHandler<ResetPasswordCommand, ResponseResult<UserOrmEntity>>
{
  constructor(
    @Inject(WRITE_USER_REPOSITORY)
    private readonly _write: IWriteUserRepository,
  ) {}

  async execute(
    command: ResetPasswordCommand,
  ): Promise<ResponseResult<UserOrmEntity>> {
    const { id, body, manager } = command;
    await findOneOrFail(
      manager,
      UserOrmEntity,
      {
        id: id,
      },
      `id: ${id}`,
    );
    return await this._write.resetPassword(id, body, manager);
  }
}
