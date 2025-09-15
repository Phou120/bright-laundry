import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { VerifyOtpCommand } from '../verify-otp.command';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { UserOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/user.orm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';

@CommandHandler(VerifyOtpCommand)
export class VerifyOtpHandler
  implements ICommandHandler<VerifyOtpCommand, ResponseResult<UserOrmEntity>>
{
  constructor() {}

  async execute(
    command: VerifyOtpCommand,
  ): Promise<ResponseResult<UserOrmEntity>> {
    const { body, manager } = command;

    const user = await findOneOrFail(
      manager,
      UserOrmEntity,
      {
        verify_otp: body.otp,
      },
      `verify_otp: ${body.otp}`,
    );

    return user;
  }
}
