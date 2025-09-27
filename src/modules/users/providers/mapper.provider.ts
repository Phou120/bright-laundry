import { Provider } from '@nestjs/common';
import { UserDataAccessMapper } from '../mappers/user.mapper';
import { PermissionDataAccessMapper } from '../mappers/permission.mapper';
import { RoleDataAccessMapper } from '../mappers/role.mapper';
import { UserProfileDataAccessMapper } from '../mappers/user-profile.mapper';
import { RolePermissionDataAccessMapper } from '../mappers/role-permission.mapper';

export const UserMapperProviders: Provider[] = [
  UserDataAccessMapper,
  PermissionDataAccessMapper,
  RoleDataAccessMapper,
  UserProfileDataAccessMapper,
  RolePermissionDataAccessMapper,
];
