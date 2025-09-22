import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class ChangePasswordDto {
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @MinLength(6, {
    message: i18nValidationMessage('validation.MIN_LENGTH', { min: 6 }),
  })
  readonly old_password: string;

  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @MinLength(6, {
    message: i18nValidationMessage('validation.MIN_LENGTH', { min: 6 }),
  })
  readonly new_password: string;
}
