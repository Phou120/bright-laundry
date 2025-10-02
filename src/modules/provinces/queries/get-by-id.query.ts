import { EntityManager } from 'typeorm';

export class GetByIdProvinceQuery {
  constructor(
    public readonly id: number,
    public readonly manager: EntityManager,
  ) {}
}
