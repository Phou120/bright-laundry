import { EntityManager } from 'typeorm';

export class GetOneRoleQuery {
  constructor(
    public readonly id: number,
    public readonly manager: EntityManager,
  ) {}
}
