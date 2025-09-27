import { RolePermissionOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/role_permission.orm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { EntityManager } from 'typeorm';

export interface IWriteRolePermissionRepository {
  addRolePermissions(
    roleId: number,
    permissionId: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<RolePermissionOrmEntity>>;

  updateRolePermissions(
    roleId: number,
    permissionId: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<RolePermissionOrmEntity>>;

  deleteRolePermissions(roleId: number, manager?: EntityManager): Promise<void>;
}
