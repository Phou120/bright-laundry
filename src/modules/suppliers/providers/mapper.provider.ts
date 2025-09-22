import { Provider } from '@nestjs/common';
import { SupplierDataAccessMapper } from '../mappers/supplier.mapper';
import { UserDataAccessMapper } from '@src/modules/users/mappers/user.mapper';
import { UserProfileDataAccessMapper } from '@src/modules/users/mappers/user-profile.mapper';

export const MapperProviders: Provider[] = [
  SupplierDataAccessMapper,
  UserDataAccessMapper,
  UserProfileDataAccessMapper,
];
