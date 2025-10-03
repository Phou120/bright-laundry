import { EntityManager } from 'typeorm';
import { DistrictQueryDto } from '../dtos/query/query.dto';

export class GetAllDistrictQuery {
  constructor(
    public readonly query: DistrictQueryDto,
    public readonly manager: EntityManager,
  ) {}
}
