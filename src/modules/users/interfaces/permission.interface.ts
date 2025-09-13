import { PermissionGroupOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/permission-group.orm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { EntityManager } from 'typeorm';
import { UserQueryDto } from '../dtos/query/query.dto';

export interface IReadPermissionRepository {
  findAll(
    query: UserQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<PermissionGroupOrmEntity>>;

  getOne(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<PermissionGroupOrmEntity>>;
}
