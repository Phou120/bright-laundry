import { EntityManager } from 'typeorm';
import { StoreUserQueryDto } from '../dtos/query/query.dto';

export class GetAllStoreUserQuery {
  constructor(
    public readonly userId: number,
    public readonly query: StoreUserQueryDto,
    public readonly manager: EntityManager,
  ) {}
}
