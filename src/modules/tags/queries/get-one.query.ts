import { EntityManager } from 'typeorm';

export class GetOneTagQuery {
  constructor(
    public readonly id: number,
    public readonly manager: EntityManager,
  ) {}
}
