import { PermissionGroupOrmEntity } from './typeorms/entities/permission-group.orm';
import { PermissionOrmEntity } from './typeorms/entities/permission.orm';
import { RoleOrmEntity } from './typeorms/entities/role.orm';
import { SeederLogOrmEntity } from './typeorms/entities/seeder-log.orm';
import { UserHasPermissionOrmEntity } from './typeorms/entities/user-has-permission.orm';
import { UserOrmEntity } from './typeorms/entities/user.orm';

export const entities = [
  UserOrmEntity,
  SeederLogOrmEntity,
  RoleOrmEntity,
  PermissionGroupOrmEntity,
  PermissionOrmEntity,
  UserHasPermissionOrmEntity,
];
