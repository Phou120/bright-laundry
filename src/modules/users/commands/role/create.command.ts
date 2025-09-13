import { EntityManager } from 'typeorm';
import { CreateRoleDto } from '../../dtos/create-role.dto';

export class CreateRoleCommand {
  constructor(
    public readonly body: CreateRoleDto,
    public readonly manager: EntityManager,
  ) {}
}
