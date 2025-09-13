import { Provider } from '@nestjs/common';
import { UserDataAccessMapper } from '../mappers/user.mapper';
import { PermissionDataAccessMapper } from '../mappers/permission.mapper';
import { RoleDataAccessMapper } from '../mappers/role.mapper';

export const UserMapperProviders: Provider[] = [
  UserDataAccessMapper,
  PermissionDataAccessMapper,
  RoleDataAccessMapper,
];
