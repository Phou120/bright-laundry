import { EntityManager } from 'typeorm';
import { UpdateDto } from '../dtos/create/update.dto';

export class UpdateStoreUserCommand {
  constructor(
    public readonly id: number,
    public readonly dto: UpdateDto,
    public readonly manager: EntityManager,
  ) {}
}
