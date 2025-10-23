import { PartialType } from '@nestjs/swagger';
import { CreateStoreDto } from './create.dto';

export class UpdateStoreDto extends PartialType(CreateStoreDto) {}
