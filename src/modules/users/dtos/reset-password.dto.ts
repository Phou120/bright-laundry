import { Match } from '@src/common/validations/match-decorator.validtator';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class ResetPasswordDto {
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @MinLength(6, {
    message: i18nValidationMessage('validation.MIN_LENGTH', { min: 6 }),
  })
  readonly password: string;

  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @MinLength(6, {
    message: i18nValidationMessage('validation.MIN_LENGTH', { min: 6 }),
  })
  @Match('password', {
    message: i18nValidationMessage('validation.PASSWORDS_DO_NOT_MATCH'),
  })
  readonly confirmPassword: string;
}
