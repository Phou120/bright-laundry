import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SendMailCommand } from '../send-mail.command';
import { Inject } from '@nestjs/common';
import {
  OTP_LENGTH,
  QUEUE_SERVICE,
  //   QUEUE_SERVICE,
  WRITE_USER_REPOSITORY,
} from '@src/common/constants/inject-key';
import { IWriteUserRepository } from '../../interfaces/repository.interface';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { UserOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/user.orm';
import { generateUniqueNumericOtp } from '@src/common/utils/generate-otp.util';
import { QueueService } from '@src/common/infrastructure/queue/queue.service';

@CommandHandler(SendMailCommand)
export class SendMailHandler implements ICommandHandler<SendMailCommand, void> {
  constructor(
    @Inject(WRITE_USER_REPOSITORY)
    private readonly _write: IWriteUserRepository,
    @Inject(QUEUE_SERVICE)
    private readonly _queue: QueueService,
  ) {}

  async execute(command: SendMailCommand): Promise<void> {
    const { body, manager } = command;
    const user = await findOneOrFail(
      command.manager,
      UserOrmEntity,
      {
        email: body.email,
      },
      `email: ${body.email}`,
    );
    const otp = await generateUniqueNumericOtp(manager, OTP_LENGTH);

    await this._queue.sendMail({ email: user.email, otp });

    await this._write.saveOTP(otp, user.id, manager);
  }
}
