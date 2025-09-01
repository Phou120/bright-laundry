import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MAIL_SERVICE } from '../consts/mail.const';
import { IMail, SendMailOptions } from '../interfaces/mailer.interface';

@Injectable()
export class MailService<Context extends { [key: string]: any }>
  implements IMail<Context>
{
  constructor(
    private _mailerService: MailerService,
    private readonly config: ConfigService,
  ) {}

  async sendMail({
    to,
    subject,
    template,
    context,
  }: SendMailOptions<Context>): Promise<void> {
    await this._mailerService.sendMail({
      from: this.config.get('MAIL_FROM'),
      to,
      subject,
      template: './' + template,
      context,
      // attachments: [
      //   {
      //     filename: 'logo.png',
      //     path: __dirname + '/templates/images/logo.png',
      //     cid: 'logo',
      //   },
      // ],
    });
  }
}

export const MailerProvider: Provider = {
  provide: MAIL_SERVICE,
  useClass: MailService,
};
