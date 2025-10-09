import { EntityManager } from 'typeorm';
import { UpdateStatusDto } from '../dtos/create/update-status.dto';

export class UpdateStatusCommand {
  constructor(
    public readonly id: number,
    public readonly dto: UpdateStatusDto,
    public readonly manager: EntityManager,
  ) {}
}
