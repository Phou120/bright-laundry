import { Catch, HttpException, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DomainException } from '@common/exceptions/domain.exception';
import { LOCALIZATION_SERVICE } from '@common/constants/inject-key';
import { ILocalizationService } from '@common/infrastructure/localization/localization.interface';
import { BaseGlobalExceptionFilter } from '@common/infrastructure/exception-handler/base-global-exception.filter';

@Catch(HttpException, DomainException, Error)
export class GlobalExceptionFilter extends BaseGlobalExceptionFilter {
  constructor(
    configService: ConfigService,
    @Inject(LOCALIZATION_SERVICE) localizationService: ILocalizationService,
  ) {
    super(configService, localizationService);
  }
}
