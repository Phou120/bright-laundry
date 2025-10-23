import { PartialType } from '@nestjs/swagger';
import { CreateClothesDto } from './create.dto';

export class UpdateClothesDto extends PartialType(CreateClothesDto) {}
