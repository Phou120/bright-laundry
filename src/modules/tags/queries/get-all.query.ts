import { EntityManager } from 'typeorm';
import { TagQueryDto } from '../dtos/query/query.dto';

export class GetAllTagQuery {
  constructor(
    public readonly query: TagQueryDto,
    public readonly manager: EntityManager,
  ) {}
}
