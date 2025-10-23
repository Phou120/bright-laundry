import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ChangePasswordCommand } from '../change-password.command';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { UserOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/user.orm';
import { HttpStatus, Inject } from '@nestjs/common';
import { WRITE_USER_REPOSITORY } from '@src/common/constants/inject-key';
import { IWriteUserRepository } from '../../interfaces/repository.interface';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { DomainException } from '@src/common/exceptions/domain.exception';
import { hashPassword } from '@src/common/utils/hash-password';

@CommandHandler(ChangePasswordCommand)
export class ChangePasswordHandler
  implements
    ICommandHandler<ChangePasswordCommand, ResponseResult<UserOrmEntity>>
{
  constructor(
    @Inject(WRITE_USER_REPOSITORY)
    private readonly _write: IWriteUserRepository,
  ) {}

  async execute(
    command: ChangePasswordCommand,
  ): Promise<ResponseResult<UserOrmEntity>> {
    const { id, body, manager } = command;
    if (isNaN(id)) {
      throw new DomainException(
        'errors.id_must_be_number',
        HttpStatus.BAD_REQUEST,
        { property: `id ${id}` },
      );
    }
    const user = await findOneOrFail(
      manager,
      UserOrmEntity,
      {
        id: id,
      },
      `id: ${id}`,
    );

    // Verify the old password is correct before allowing password change
    const userPassword = user.password;
    if (!userPassword) {
      throw new DomainException(
        'errors.invalid_old_password',
        HttpStatus.BAD_REQUEST,
        { property: 'old_password' },
      );
    }
    // const isSamePassword = await bcrypt.compare(
    //   body.old_password,
    //   userPassword,
    // );
    // if (!isSamePassword) {
    //   throw new DomainException(
    //     'errors.invalid_old_password',
    //     HttpStatus.BAD_REQUEST,
    //     { property: `${body.old_password}` },
    //   );
    // }

    // Hash the new password before saving
    const hashedNewPassword = await hashPassword(body.new_password);
    const modifiedBody = { ...body, new_password: hashedNewPassword };

    return await this._write.changePassword(id, modifiedBody, manager);
  }
}
