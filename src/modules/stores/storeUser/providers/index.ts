import { Provider } from '@nestjs/common';
import { commandProviders } from './command.provider';
import { MapperProviders } from './mapper.provider';
import {
  LOCALIZATION_SERVICE,
  READ_STORE_USER_REPOSITORY,
  STORE_USER_SERVICE,
  TRANSACTION_MANAGER_SERVICE,
  WRITE_STORE_USER_REPOSITORY,
  WRITE_USER_PERMISSION_REPOSITORY,
  WRITE_USER_PROFILE_REPOSITORY,
  WRITE_USER_REPOSITORY,
} from '@src/common/constants/inject-key';
import { LocalizationService } from '@src/common/infrastructure/localization/localization.service';
import { WriteStoreUserRepository } from '../repositories/write.repo';
import { TransactionManagerService } from '@src/common/infrastructure/transaction/transaction.service';
import { StoreUserService } from '../services/store-user.service';
import { WriteUserRepository } from '@src/modules/users/repositories/write.repo';
import { WriteUserProfileRepository } from '@src/modules/users/repositories/profile/write.repo';
import { WriteUserPermissionRepository } from '@src/modules/users/repositories/userPermission/write.repo';
import { ReadStoreUserRepository } from '../repositories/read.repo';

export const storeUserProvider: Provider[] = [
  ...commandProviders,
  ...MapperProviders,
  {
    provide: LOCALIZATION_SERVICE,
    useClass: LocalizationService,
  },
  {
    provide: TRANSACTION_MANAGER_SERVICE,
    useClass: TransactionManagerService,
  },
  {
    provide: WRITE_STORE_USER_REPOSITORY,
    useClass: WriteStoreUserRepository,
  },
  {
    provide: STORE_USER_SERVICE,
    useClass: StoreUserService,
  },
  {
    provide: WRITE_USER_REPOSITORY,
    useClass: WriteUserRepository,
  },
  {
    provide: WRITE_USER_PROFILE_REPOSITORY,
    useClass: WriteUserProfileRepository,
  },
  {
    provide: WRITE_USER_PERMISSION_REPOSITORY,
    useClass: WriteUserPermissionRepository,
  },
  {
    provide: READ_STORE_USER_REPOSITORY,
    useClass: ReadStoreUserRepository,
  },
];
