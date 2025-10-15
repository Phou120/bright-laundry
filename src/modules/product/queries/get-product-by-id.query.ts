import { EntityManager } from 'typeorm';

export class GetProductByIdQuery {
  constructor(
    public readonly id: number,
    public readonly manager: EntityManager,
  ) {}
}