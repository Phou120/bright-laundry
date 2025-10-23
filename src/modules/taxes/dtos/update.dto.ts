import { PartialType } from '@nestjs/swagger';
import { CreateTaxDto } from './create.dto';

export class UpdateTaxDto extends PartialType(CreateTaxDto) {}