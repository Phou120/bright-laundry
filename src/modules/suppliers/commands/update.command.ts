import { EntityManager } from 'typeorm';
import { UpdateDto } from '../dtos/update.dto';

export class UpdateCommand {
  constructor(
    public readonly id: number,
    public readonly body: UpdateDto,
    public readonly user_id: number,
    public readonly manager: EntityManager,
  ) {}
}
