import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '@src/common/validations/dtos/pagination.dto';
import { IsOptional, IsString } from 'class-validator';

export class ProductAttributeQueryDto extends PaginationDto {
  @ApiProperty({
    required: false,
    description: 'Search by name',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  store_id?: string;
}
