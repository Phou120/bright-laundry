import { MailerOptions } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

export const MailerConfig = (config: ConfigService): MailerOptions => {
  const templatePath = join(__dirname, '..', 'templates');

  return {
    transport: {
      host: config.get('MAIL_HOST'),
      port: Number(config.get('MAIL_PORT')),
      secure: false,
      auth: {
        user: config.get('MAIL_USER'),
        pass: config.get('MAIL_PASSWORD'),
      },
    },
    defaults: {
      from: `"E-COMMERCE" <${config.get('MAIL_FROM')}>`,
    },
    template: {
      dir: templatePath,
      adapter: new HandlebarsAdapter(),
      options: {
        strict: true,
      },
    },
  };
};
