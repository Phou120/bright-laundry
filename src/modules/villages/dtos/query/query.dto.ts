import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '@src/common/validations/dtos/pagination.dto';

export class VillageQueryDto extends PaginationDto {
  @ApiProperty({
    required: false,
    description: 'can be name_lo, name_en',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    required: false,
    description: 'Filter by district ID',
  })
  @IsOptional()
  district_id?: number | string;
}
