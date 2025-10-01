import { OmitType } from '@nestjs/swagger';
import { CreateStoreUserDto } from './create.dto';

export class UpdateDto extends OmitType(CreateStoreUserDto, [
  'password',
] as const) {}
