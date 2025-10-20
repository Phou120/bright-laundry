import { IsString, IsOptional, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBannerDto {
  @ApiPropertyOptional({
    description: 'Banner image file URL or path',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  file_banner?: string;

  @ApiPropertyOptional({
    description: 'Banner link URL',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  link?: string;

  @ApiPropertyOptional({
    description: 'Banner order',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  order_by?: string;
}
