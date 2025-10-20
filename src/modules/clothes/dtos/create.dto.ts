import { IsString, IsOptional, IsNumber, MaxLength, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateClothesDto {
  @ApiProperty({
    description: 'Clothing name',
    maxLength: 255,
  })
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({
    description: 'Clothing price',
    minimum: 0,
    example: 10.99,
  })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price: number;
}