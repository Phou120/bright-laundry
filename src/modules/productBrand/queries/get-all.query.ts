import { EntityManager } from 'typeorm';
import { ProductBrandQueryDto } from '../dtos/query/query.dto';

export class GetAllQuery {
  constructor(
    public readonly query: ProductBrandQueryDto,
    public readonly manager: EntityManager,
  ) {}
}
