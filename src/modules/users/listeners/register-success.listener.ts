import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { RegisterSuccessEvent } from '../events/register-success.event';
import { Inject } from '@nestjs/common';
import { MAIL_SERVICE } from '@src/common/infrastructure/mailer/consts/mail.const';
import { IMail } from '@src/common/infrastructure/mailer/interfaces/mailer.interface';
import { ConfigService } from '@nestjs/config';

@EventsHandler(RegisterSuccessEvent)
export class RegisterSuccessListener
  implements IEventHandler<RegisterSuccessEvent>
{
  private readonly MESSAGE: string;
  constructor(
    @Inject(MAIL_SERVICE) private readonly _mailer: IMail<any>,
    private readonly configService: ConfigService,
  ) {
    this.MESSAGE = this.configService.get<string>('MESSAGE') ?? '';
  }

  async handle({ data }: RegisterSuccessEvent): Promise<any> {
    const payload = (data ?? {}) as { email?: string; otp?: string | number };
    const to = payload.email ?? '';
    const otp = payload.otp ?? '';

    await this._mailer.sendMail({
      to,
      subject: this.MESSAGE,
      template: 'send-otp',
      context: { otp },
    });
  }
}
