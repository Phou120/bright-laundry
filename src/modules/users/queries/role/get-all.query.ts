import { EntityManager } from 'typeorm';
import { UserQueryDto } from '../../dtos/query/query.dto';

export class GetAllRoleQuery {
  constructor(
    public readonly query: UserQueryDto,
    public readonly manager: EntityManager,
  ) {}
}
