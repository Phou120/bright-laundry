import { Provider } from '@nestjs/common';
import { StoreUserDataAccessMapper } from '../mappers/store-user.mapper';
import { UserDataAccessMapper } from '@src/modules/users/mappers/user.mapper';
import { UserProfileDataAccessMapper } from '@src/modules/users/mappers/user-profile.mapper';
import { UserPermissionDataAccessMapper } from '@src/modules/users/mappers/user-permission.mapper';

export const MapperProviders: Provider[] = [
  StoreUserDataAccessMapper,
  UserDataAccessMapper,
  UserProfileDataAccessMapper,
  UserPermissionDataAccessMapper,
];
