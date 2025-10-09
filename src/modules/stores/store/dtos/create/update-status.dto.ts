import { EnumStoreStatusString } from '@src/common/enums/orm-entity-method.enum';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class UpdateStatusDto {
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsEnum(EnumStoreStatusString, {
    message: i18nValidationMessage('validation.IS_ENUM'),
  })
  readonly status: EnumStoreStatusString;
}
