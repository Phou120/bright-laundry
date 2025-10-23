import { IsString, IsOptional, MaxLength } from 'class-validator';
import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateLaundryMachineDto } from './create.dto';

export class UpdateLaundryMachineDto extends PartialType(
  CreateLaundryMachineDto,
) {}
