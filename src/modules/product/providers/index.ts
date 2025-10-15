import { Provider } from '@nestjs/common';
import {
  PRODUCT_SERVICE,
  LOCALIZATION_SERVICE,
  READ_PRODUCT_REPOSITORY,
  TRANSACTION_MANAGER_SERVICE,
  WRITE_PRODUCT_REPOSITORY,
} from '@src/common/constants/inject-key';
import { LocalizationService } from '@src/common/infrastructure/localization/localization.service';
import { TransactionManagerService } from '@src/common/infrastructure/transaction/transaction.service';
import { ProductService } from '../services/product.service';
import { WriteProductRepository } from '../repositories/write.repo';
import { ReadProductRepository } from '../repositories/read.repo';
import { commandProviders } from './command.provider';
import { MapperProviders } from './mapper.provider';

export const productProviders: Provider[] = [
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
    provide: PRODUCT_SERVICE,
    useClass: ProductService,
  },
  {
    provide: WRITE_PRODUCT_REPOSITORY,
    useClass: WriteProductRepository,
  },
  {
    provide: READ_PRODUCT_REPOSITORY,
    useClass: ReadProductRepository,
  },
];
