import { EntityManager } from 'typeorm';

export class GetOnePermissionQuery {
  constructor(
    public readonly id: number,
    public readonly manager: EntityManager,
  ) {}
}
