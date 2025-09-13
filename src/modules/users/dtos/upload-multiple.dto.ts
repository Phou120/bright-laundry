import { IsArray, ArrayNotEmpty } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class UploadMultipleDto {
  //   @Transform(({ value }) =>
  //     Array.isArray(value) ? value : value == null ? [] : [value],
  //   )
  @IsArray({ message: i18nValidationMessage('validation.IS_ARRAY') })
  @ArrayNotEmpty({
    message: i18nValidationMessage('validation.ARRAY_NOT_EMPTY'),
  })
  readonly images: string[];
}
