import { OmitType } from '@nestjs/swagger';
import { CreateDto } from './create.dto';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { Match } from '@src/common/decorator/match.decorator';

export class UpdateDto extends OmitType(CreateDto, ['password', 'surname']) {
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  readonly surname: string;

  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  readonly password: string;

  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @Match('password', {
    message: i18nValidationMessage('validation.PASSWORDS_NOT_MATCH'),
  })
  readonly confirmPassword: string;
}
