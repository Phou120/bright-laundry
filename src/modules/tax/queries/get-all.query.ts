import { EntityManager } from 'typeorm';
import { TaxQueryDto } from '../dtos/query/query.dto';

export class GetAllTaxQuery {
  constructor(
    public query: TaxQueryDto,
    public manager: EntityManager,
  ) {}
}
