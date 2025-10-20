import { IsString, IsOptional, IsEmail, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateStoreDto {
  @ApiPropertyOptional({
    description: 'Store name',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

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
}