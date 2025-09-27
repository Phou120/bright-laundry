import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { PermissionOrmEntity } from './permission.orm';
import { RoleOrmEntity } from './role.orm';

@Entity('role_permissions')
export class RolePermissionOrmEntity {
  @PrimaryColumn({ name: 'role_id', type: 'int' })
  role_id: number;

  @PrimaryColumn({ name: 'permission_id', type: 'bigint', unsigned: true })
  permission_id: number;

  @ManyToOne(
    () => PermissionOrmEntity,
    (permission) => permission.role_permissions,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'permission_id' })
  permission: PermissionOrmEntity;

  @ManyToOne(() => RoleOrmEntity, (role) => role.role_permissions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'role_id' })
  role: RoleOrmEntity;
}
