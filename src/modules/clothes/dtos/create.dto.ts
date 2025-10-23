import { IsNotEmpty, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateClothesDto {
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  name: string;

  // @ApiProperty({
  //   description: 'Clothing price',
  //   minimum: 0,
  //   example: 10.99,
  // })
  // @IsNumber()
  // @Min(0)
  // @Type(() => Number)
  // price: number;
}
