import { EntityManager } from 'typeorm';
import { ProvinceQueryDto } from '../dtos/query/query.dto';

export class GetAllProvinceQuery {
  constructor(
    public readonly query: ProvinceQueryDto,
    public readonly manager: EntityManager,
  ) {}
}
