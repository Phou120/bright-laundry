import { EntityManager } from 'typeorm';
import { UpdateRoleDto } from '../../dtos/update-role.dto';

export class UpdateRoleCommand {
  constructor(
    public readonly id: number,
    public readonly body: UpdateRoleDto,
    public readonly manager: EntityManager,
  ) {}
}
