import { EntityManager } from 'typeorm';

export class GetByIdVillageQuery {
  constructor(
    public readonly id: number,
    public readonly manager: EntityManager,
  ) {}
}