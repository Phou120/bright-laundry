import { PartialType } from '@nestjs/swagger';
import {
  CreateLaundryMachineDto,
  CreateWashingMachineDetailDto,
} from './create.dto';

export class UpdateLaundryMachineDto extends PartialType(
  CreateLaundryMachineDto,
) {}

export class UpdateWashingMachineDetailDto extends PartialType(
  CreateWashingMachineDetailDto,
) {}
