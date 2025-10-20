import {
  IsString,
  IsOptional,
  IsEmail,
  MaxLength,
  IsObject,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateUserWithStoreDto {
  @ApiProperty({
    description: 'User name',
    maxLength: 255,
  })
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({
    description: 'User surname',
    maxLength: 255,
  })
  @IsString()
  @MaxLength(255)
  surname: string;

  @ApiProperty({
    description: 'User email',
    maxLength: 255,
  })
  @IsEmail()
  @MaxLength(255)
  email: string;

  @ApiProperty({
    description: 'User password',
    maxLength: 255,
  })
  @IsString()
  @MaxLength(255)
  password: string;

  @ApiPropertyOptional({
    description: 'User telephone',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  tel?: string;
}

export class CreateStoreDto {
  @ApiProperty({
    description: 'Store name',
    maxLength: 255,
  })
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional({
    description: 'Store email',
    maxLength: 255,
  })
  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email?: string;

  @ApiPropertyOptional({
    description: 'Store telephone',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
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
  @IsOptional()
  @IsString()
  @MaxLength(255)
  bank_name?: string;

  @ApiPropertyOptional({
    description: 'Bank account number',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  bank_account_number?: string;

  @ApiPropertyOptional({
    description: 'Store description',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Store policy',
  })
  @IsOptional()
  @IsString()
  policy?: string;

  @ApiPropertyOptional({
    description: 'Store status ID',
  })
  @IsOptional()
  store_status_id?: number;

  @ApiPropertyOptional({
    description: 'Tax ID',
  })
  @IsOptional()
  tax_id?: number;

  @ApiPropertyOptional({
    description: 'Create store with user',
    type: CreateUserWithStoreDto,
  })
  @IsOptional()
  @IsObject()
  @Type(() => CreateUserWithStoreDto)
  user?: CreateUserWithStoreDto;
}
