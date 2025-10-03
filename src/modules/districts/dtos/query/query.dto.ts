import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '@src/common/validations/dtos/pagination.dto';

export class DistrictQueryDto extends PaginationDto {
  @ApiProperty({
    required: false,
    description: 'can be name_lo, name_en',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    required: false,
    description: 'Filter by province ID',
  })
  @IsOptional()
  province_id?: number | string;
}
