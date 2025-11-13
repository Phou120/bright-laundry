import {
  IsNumber,
  IsNotEmpty,
  IsArray,
  ValidateNested,
  Min,
  ArrayMinSize,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { Type } from 'class-transformer';

export class CreateWashingMachineDetailDto {
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsNumber({}, { message: i18nValidationMessage('validation.IS_NUMBER') })
  clothes_id: number;

  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsNumber({}, { message: i18nValidationMessage('validation.IS_NUMBER') })
  @Min(1, { message: i18nValidationMessage('validation.MIN') })
  quantity: number;
}

export class CreateLaundryMachineDto {
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsNumber({}, { message: i18nValidationMessage('validation.IS_NUMBER') })
  customer_id?: number;

  @IsArray({ message: i18nValidationMessage('validation.IS_ARRAY') })
  @ArrayMinSize(1, {
    message: i18nValidationMessage('validation.IS_NOT_EMPTY'),
  }) // Use this to explicitly check for array length > 0
  @ValidateNested({ each: true })
  @Type(() => CreateWashingMachineDetailDto)
  details?: CreateWashingMachineDetailDto[];
}
