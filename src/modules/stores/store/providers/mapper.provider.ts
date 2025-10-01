import { Provider } from '@nestjs/common';
import { StoreDataAccessMapper } from '../mappers/store.mapper';
import { UserDataAccessMapper } from '@src/modules/users/mappers/user.mapper';
import { UserProfileDataAccessMapper } from '@src/modules/users/mappers/user-profile.mapper';
import { TagDataAccessMapper } from '@src/modules/tags/mappers/tag.mapper';

export const MapperProviders: Provider[] = [
  StoreDataAccessMapper,
  UserDataAccessMapper,
  UserProfileDataAccessMapper,
  TagDataAccessMapper,
];
