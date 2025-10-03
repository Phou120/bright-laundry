import { EntityManager } from 'typeorm';
import { VillageQueryDto } from '../dtos/query/query.dto';

export class GetAllVillageQuery {
  constructor(
    public readonly query: VillageQueryDto,
    public readonly manager: EntityManager,
  ) {}
}
