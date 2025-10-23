import {
  IsString,
  IsOptional,
  IsEmail,
  MaxLength,
  IsObject,
  IsNotEmpty,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateUserWithStoreDto {
  @ApiProperty({
    description: 'User name',
    maxLength: 255,
  })
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @MaxLength(255)
  name: string;

  @ApiProperty({
    description: 'User surname',
    maxLength: 255,
  })
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @MaxLength(255)
  surname: string;

  @ApiProperty({
    description: 'User email',
    maxLength: 255,
  })
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsEmail({}, { message: i18nValidationMessage('validation.IS_EMAIL') })
  @MaxLength(255)
  email: string;

  @ApiProperty({
    description: 'User password',
    maxLength: 255,
  })
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @MinLength(6, { message: i18nValidationMessage('validation.MIN_LENGTH') })
  @MaxLength(255)
  password: string;

  @ApiPropertyOptional({
    description: 'User telephone',
    maxLength: 255,
  })
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @MaxLength(255)
  tel?: string;
}

export class CreateStoreDto {
  @ApiProperty({
    description: 'Store name',
    maxLength: 255,
  })
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  name: string;

  @ApiPropertyOptional({
    description: 'Store email',
    maxLength: 255,
  })
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsEmail({}, { message: i18nValidationMessage('validation.IS_EMAIL') })
  email?: string;

  @ApiPropertyOptional({
    description: 'Store telephone',
    maxLength: 255,
  })
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  tel?: string;

  @ApiPropertyOptional({
    description: 'Store address',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  address?: string;

  @ApiPropertyOptional({
    description: 'Store logo URL',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  logo?: string;

  @ApiPropertyOptional({
    description: 'Map link',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  map_link?: string;

  @ApiPropertyOptional({
    description: 'Bank name',
    maxLength: 255,
  })
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  bank_name?: string;

  @ApiPropertyOptional({
    description: 'Bank account number',
    maxLength: 255,
  })
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @MaxLength(255)
  bank_account_number?: string;

  @ApiPropertyOptional({
    description: 'Store description',
  })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  description?: string;

  @ApiPropertyOptional({
    description: 'Store policy',
  })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  policy?: string;

  @ApiPropertyOptional({
    description: 'Create store with user',
    type: CreateUserWithStoreDto,
  })
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsObject()
  @Type(() => CreateUserWithStoreDto)
  user: CreateUserWithStoreDto;
}
