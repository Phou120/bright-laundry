import { Provider } from '@nestjs/common';
import { commandProviders } from './command.provider';
import { MapperProviders } from './mapper.provider';
import { LocalizationService } from '@src/common/infrastructure/localization/localization.service';
import {
  CATEGORY_SERVICE,
  LOCALIZATION_SERVICE,
  READ_CATEGORY_REPOSITORY,
  TRANSACTION_MANAGER_SERVICE,
  WRITE_CATEGORY_REPOSITORY,
} from '@src/common/constants/inject-key';
import { TransactionManagerService } from '@src/common/infrastructure/transaction/transaction.service';
import { CategoryService } from '../services/category.service';
import { WriteCategoryRepository } from '../repositories/write.repo';
import { ReadCategoryRepository } from '../repositories/read.repo';

export const categoryProvider: Provider[] = [
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
    provide: CATEGORY_SERVICE,
    useClass: CategoryService,
  },
  {
    provide: WRITE_CATEGORY_REPOSITORY,
    useClass: WriteCategoryRepository,
  },
  {
    provide: READ_CATEGORY_REPOSITORY,
    useClass: ReadCategoryRepository,
  },
];
