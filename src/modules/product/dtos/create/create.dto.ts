import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { ProductType } from '@src/common/infrastructure/database/typeorms/entities/product.orm';

export class CreateProductDto {
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  name: string;

  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  description?: string;

  @IsOptional()
  @IsEnum(ProductType, { message: i18nValidationMessage('validation.IS_ENUM') })
  product_type?: ProductType;

  @IsNumber({}, { message: i18nValidationMessage('validation.IS_NUMBER') })
  store_id: number;
}
