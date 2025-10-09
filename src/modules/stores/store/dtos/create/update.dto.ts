import { OmitType } from '@nestjs/swagger';
import { CreateDto } from './create.dto';
import { IsOptional, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class UpdateDto extends OmitType(CreateDto, ['password', 'surname']) {
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  readonly surname: string;

  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  readonly password: string;
}
