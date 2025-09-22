import { Provider } from '@nestjs/common';
import { commandProviders } from './command.provider';
import { MapperProviders } from './mapper.provider';
import {
  LOCALIZATION_SERVICE,
  READ_TAG_REPOSITORY,
  TAG_SERVICE,
  TRANSACTION_MANAGER_SERVICE,
  WRITE_TAG_REPOSITORY,
} from '@src/common/constants/inject-key';
import { LocalizationService } from '@src/common/infrastructure/localization/localization.service';
import { TransactionManagerService } from '@src/common/infrastructure/transaction/transaction.service';
import { TagService } from '../services/tag.service';
import { WriteTagRepository } from '../repositories/write.repo';
import { ReadTagRepository } from '../repositories/read.repo';

export const tagProvider: Provider[] = [
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
    provide: TAG_SERVICE,
    useClass: TagService,
  },
  {
    provide: WRITE_TAG_REPOSITORY,
    useClass: WriteTagRepository,
  },
  {
    provide: READ_TAG_REPOSITORY,
    useClass: ReadTagRepository,
  },
];
