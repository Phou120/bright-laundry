import { UserHasPermissionOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/user-has-permission.orm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { EntityManager } from 'typeorm';

export interface IWriteUserPermissionRepository {
  create(
    userId: number,
    permissionId: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<UserHasPermissionOrmEntity>>;

  delete(userId: number, manager?: EntityManager): Promise<void>;
}
