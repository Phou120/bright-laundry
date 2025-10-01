import { EntityManager } from 'typeorm';
import { StoreQueryDto } from '../dtos/query/query.dto';

export class GetAllStoreQuery {
  constructor(
    public readonly query: StoreQueryDto,
    public readonly manager: EntityManager,
  ) {}
}
