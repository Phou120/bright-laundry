import { EntityManager } from 'typeorm';

export class DeleteRoleCommand {
  constructor(
    public readonly id: number,
    public readonly manager: EntityManager,
  ) {}
}
