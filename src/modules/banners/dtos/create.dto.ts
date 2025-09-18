import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateDto {
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  readonly file_banner: string;

  @Transform(({ value }: { value: string }) =>
    value === '' ? undefined : value,
  )
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsUrl(
    { protocols: ['http', 'https'], require_protocol: true, require_tld: true },
    { message: i18nValidationMessage('validation.IS_URL') },
  )
  readonly link?: string;

  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsNumber({}, { message: i18nValidationMessage('validation.IS_NUMBER') })
  readonly order_by: number;
}
