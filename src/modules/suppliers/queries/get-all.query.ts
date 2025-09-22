import { EntityManager } from 'typeorm';
import { SupplierQueryDto } from '../dtos/query/query.dto';

export class GetAllQuery {
  constructor(
    public readonly query: SupplierQueryDto,
    public readonly manager: EntityManager,
  ) {}
}
