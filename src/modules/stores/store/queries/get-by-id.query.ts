import { EntityManager } from 'typeorm';

export class GetByIdStoreQuery {
  constructor(
    public id: number,
    public manager: EntityManager,
  ) {}
}
