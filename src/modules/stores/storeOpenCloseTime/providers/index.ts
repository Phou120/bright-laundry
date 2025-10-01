import { Provider } from '@nestjs/common';
import { MapperProviders } from './mapper.provider';
import {
  LOCALIZATION_SERVICE,
  TRANSACTION_MANAGER_SERVICE,
  WRITE_OPEN_CLOSE_STORE_REPOSITORY,
} from '@src/common/constants/inject-key';
import { LocalizationService } from '@src/common/infrastructure/localization/localization.service';
import { TransactionManagerService } from '@src/common/infrastructure/transaction/transaction.service';
import { WriteStoreOpenCloseTimeRepository } from '../repositories/write.repo';

export const storeOpenCloseTimeProvider: Provider[] = [
  //   ...commandProviders,
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
    provide: WRITE_OPEN_CLOSE_STORE_REPOSITORY,
    useClass: WriteStoreOpenCloseTimeRepository,
  },
];
