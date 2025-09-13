import { EntityManager } from 'typeorm';

export class GetOneUserQuery {
  constructor(
    public readonly id: number,
    public readonly manager: EntityManager,
  ) {}
}
