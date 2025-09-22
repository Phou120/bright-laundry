import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '@src/common/validations/dtos/pagination.dto';
import { IsOptional, IsString } from 'class-validator';

export class SupplierQueryDto extends PaginationDto {
  @ApiProperty({
    required: false,
    description: 'can be code, name',
  })
  @IsOptional()
  @IsString()
  search?: string;
}
