import { Global, Module } from '@nestjs/common';
import { TRANSFORM_RESULT_SERVICE } from '@common/constants/inject-key';
import { TransformResultService } from '@common/infrastructure/transform/transform.service';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { TransformResponseInterceptor } from '@common/interceptors/transform.interceptor';
import { GlobalExceptionFilter } from '@common/filters/global-exception.filter';
import { ConfigModule } from '@nestjs/config';
import { MailModule } from '@common/infrastructure/mailer/module/mailer.module';
import { I18nModule } from '@common/infrastructure/localization/localization.module';
import { TypeOrmRepositoryModule } from '@common/infrastructure/database/typrorm.module';
import { PaginationModule } from '@common/infrastructure/pagination/pagination.module';
import { AmazonS3Module } from './infrastructure/aws3/config/aws3.module';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MailModule,
    I18nModule,
    AmazonS3Module.forRootAsync(),
    TypeOrmRepositoryModule,
    PaginationModule,
  ],
  providers: [
    {
      provide: TRANSFORM_RESULT_SERVICE,
      useClass: TransformResultService,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
  exports: [TRANSFORM_RESULT_SERVICE],
})
export class CommonModule {}
