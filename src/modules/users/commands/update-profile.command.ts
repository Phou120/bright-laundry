import { EntityManager } from 'typeorm';
import { UpdateProfileDto } from '../dtos/update-profile.dto';

export class UpdateProfileCommand {
  constructor(
    public readonly id: number,
    public readonly body: UpdateProfileDto,
    public readonly manager: EntityManager,
  ) {}
}
