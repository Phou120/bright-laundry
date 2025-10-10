import { EntityManager } from 'typeorm';
import { ProductAttributeQueryDto } from '../dtos/query/query.dto';

export class GetAllQuery {
  constructor(
    public readonly query: ProductAttributeQueryDto,
    public readonly manager: EntityManager,
  ) {}
}