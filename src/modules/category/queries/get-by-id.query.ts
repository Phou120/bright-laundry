import { EntityManager } from 'typeorm';

export class GetByIdQuery {
  constructor(
    public readonly id: number,
    public readonly manager: EntityManager,
  ) {}
}
