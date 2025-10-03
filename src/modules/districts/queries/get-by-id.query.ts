import { EntityManager } from 'typeorm';

export class GetByIdDistrictQuery {
  constructor(
    public readonly id: number,
    public readonly manager: EntityManager,
  ) {}
}
