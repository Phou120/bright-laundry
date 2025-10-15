import { EntityManager } from 'typeorm';
import { ProductQueryDto } from '../dtos/query/query.dto';

export class GetAllProductsQuery {
  constructor(
    public readonly query: ProductQueryDto,
    public readonly manager: EntityManager,
  ) {}
}