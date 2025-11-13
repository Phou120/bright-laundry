import { OmitType } from '@nestjs/swagger';
import { CreateDto } from './create.dto';

export class UpdateDto extends OmitType(CreateDto, [
  'password',
  'confirm_password',
  'roles',
  'permissions',
] as const) {}
