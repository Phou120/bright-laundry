import { PermissionGroupOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/permission-group.orm';
import { PermissionOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/permission.orm';

export class PermissionDataAccessMapper {
  // Convert an array of PermissionOrmEntity to simple objects
  toEntities(ormPermissions: PermissionOrmEntity[]): PermissionOrmEntity[] {
    return ormPermissions.map((perm) => ({
      id: perm.id,
      name: perm.name,
      display_name: perm.display_name,
      guard_name: perm.guard_name,
      permission_groups: perm.permission_groups,
      role_permissions: perm.role_permissions,
      created_at: perm.created_at,
      updated_at: perm.updated_at,
      deleted_at: perm.deleted_at,
      userHasPermissions: perm.userHasPermissions,
    }));
  }

  // Convert a PermissionGroupOrmEntity with nested permissions
  toEntity(ormData: PermissionGroupOrmEntity): PermissionGroupOrmEntity {
    const permissions = (ormData.permissions || []).map((p) => ({
      id: p.id,
      name: p.name,
      display_name: p.display_name,
      guard_name: p.guard_name,
      permission_groups: p.permission_groups,
      role_permissions: p.role_permissions,
      created_at: p.created_at,
      updated_at: p.updated_at,
      deleted_at: p.deleted_at,
      userHasPermissions: p.userHasPermissions,
    }));

    return {
      id: ormData.id,
      name: ormData.name,
      display_name: ormData.display_name,
      type: ormData.type,
      permissions: permissions,
      created_at: ormData.created_at,
      updated_at: ormData.updated_at,
      deleted_at: ormData.deleted_at,
    };
  }
}
