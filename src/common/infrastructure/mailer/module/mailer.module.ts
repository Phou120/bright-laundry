import { MailerModule } from '@nestjs-modules/mailer';
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerConfig } from '../config/mailer.config';
import { MailerProvider } from '../services/mailer.service';

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: MailerConfig,
      inject: [ConfigService],
    }),
  ],
  providers: [MailerProvider],
  exports: [MailerProvider],
})
export class MailModule {}
