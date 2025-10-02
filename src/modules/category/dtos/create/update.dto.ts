import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class UpdateDto {
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  readonly name: string;

  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  readonly image?: string;
}
