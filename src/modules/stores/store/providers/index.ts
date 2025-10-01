import { Provider } from '@nestjs/common';
import { commandProviders } from './command.provider';
import { MapperProviders } from './mapper.provider';
import {
  LOCALIZATION_SERVICE,
  READ_STORE_REPOSITORY,
  STORE_SERVICE,
  TRANSACTION_MANAGER_SERVICE,
  WRITE_STORE_REPOSITORY,
  WRITE_USER_REPOSITORY,
} from '@src/common/constants/inject-key';
import { LocalizationService } from '@src/common/infrastructure/localization/localization.service';
import { TransactionManagerService } from '@src/common/infrastructure/transaction/transaction.service';
import { StoreService } from '../services/store.service';
import { WriteStoreRepository } from '../repositories/write.repo';
import { WriteUserRepository } from '@src/modules/users/repositories/write.repo';
import { ReadStoreRepository } from '../repositories/read.repo';

export const storeProvider: Provider[] = [
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
    provide: STORE_SERVICE,
    useClass: StoreService,
  },
  {
    provide: WRITE_STORE_REPOSITORY,
    useClass: WriteStoreRepository,
  },
  {
    provide: WRITE_USER_REPOSITORY,
    useClass: WriteUserRepository,
  },
  {
    provide: READ_STORE_REPOSITORY,
    useClass: ReadStoreRepository,
  },
];
