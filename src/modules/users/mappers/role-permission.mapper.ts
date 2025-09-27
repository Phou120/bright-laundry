import { Injectable } from '@nestjs/common';
import { RolePermissionOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/role_permission.orm';

@Injectable()
export class RolePermissionDataAccessMapper {
  toOrmEntity(permission_id: number, role_id: number): RolePermissionOrmEntity {
    const ormEntity = new RolePermissionOrmEntity();
    ormEntity.role_id = role_id;
    ormEntity.permission_id = permission_id;

    return ormEntity;
  }

  toEntity(ormData: RolePermissionOrmEntity): RolePermissionOrmEntity {
    return {
      role_id: ormData.role_id,
      permission_id: ormData.permission_id,
    } as unknown as RolePermissionOrmEntity;
  }
}
