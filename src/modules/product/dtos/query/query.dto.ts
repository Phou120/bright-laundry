import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '@src/common/validations/dtos/pagination.dto';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ProductType } from '@src/common/infrastructure/database/typeorms/entities/product.orm';

export class ProductQueryDto extends PaginationDto {
  @ApiProperty({
    required: false,
    description: 'Search by name or description',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    required: false,
    description: 'Filter by store ID',
  })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value ? Number(value) : undefined))
  store_id?: number;

  @ApiProperty({
    required: false,
    description: 'Filter by product type',
    enum: ProductType,
  })
  @IsOptional()
  @IsEnum(ProductType)
  product_type?: ProductType;
}
