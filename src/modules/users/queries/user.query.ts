import { EntityManager } from 'typeorm';
import { UserQueryDto } from '../dtos/query/query.dto';

export class GetAllUserQuery {
  constructor(
    public readonly query: UserQueryDto,
    public readonly manager: EntityManager,
  ) {}
}
