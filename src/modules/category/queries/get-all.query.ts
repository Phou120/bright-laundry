import { EntityManager } from 'typeorm';
import { CategoryQueryDto } from '../dtos/query/query.dto';

export class GetAllQuery {
  constructor(
    public readonly query: CategoryQueryDto,
    public readonly manager?: EntityManager,
  ) {}
}
