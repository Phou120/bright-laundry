import { Provider } from '@nestjs/common';
import {
  PRODUCT_ATTRIBUTE_SERVICE,
  LOCALIZATION_SERVICE,
  READ_PRODUCT_ATTRIBUTE_REPOSITORY,
  TRANSACTION_MANAGER_SERVICE,
  WRITE_PRODUCT_ATTRIBUTE_REPOSITORY,
} from '@src/common/constants/inject-key';
import { LocalizationService } from '@src/common/infrastructure/localization/localization.service';
import { TransactionManagerService } from '@src/common/infrastructure/transaction/transaction.service';
import { ProductAttributeService } from '../services/product-attribute.service';
import { WriteProductAttributeRepository } from '../repositories/write.repo';
import { ReadProductAttributeRepository } from '../repositories/read.repo';
import { commandProviders } from './command.provider';
import { MapperProviders } from './mapper.provider';

export const productAttributeProvider: Provider[] = [
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
    provide: PRODUCT_ATTRIBUTE_SERVICE,
    useClass: ProductAttributeService,
  },
  {
    provide: WRITE_PRODUCT_ATTRIBUTE_REPOSITORY,
    useClass: WriteProductAttributeRepository,
  },
  {
    provide: READ_PRODUCT_ATTRIBUTE_REPOSITORY,
    useClass: ReadProductAttributeRepository,
  },
];
