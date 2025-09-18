import { EntityManager } from 'typeorm';

export class GetByIdBannerQuery {
  constructor(
    public readonly id: number,
    public readonly manager: EntityManager,
  ) {}
}
