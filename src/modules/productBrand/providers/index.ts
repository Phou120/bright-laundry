import { Provider } from '@nestjs/common';
import { commandProviders } from './command.provider';
import { BrandMapperProviders } from './mapper.provider';
import {
  BRAND_SERVICE,
  LOCALIZATION_SERVICE,
  READ_BRAND_REPOSITORY,
  TRANSACTION_MANAGER_SERVICE,
  WRITE_BRAND_REPOSITORY,
} from '@src/common/constants/inject-key';
import { LocalizationService } from '@src/common/infrastructure/localization/localization.service';
import { TransactionManagerService } from '@src/common/infrastructure/transaction/transaction.service';
import { BrandService } from '../services/brand.service';
import { WriteProductBrandRepository } from '../repositories/write.repo';
import { ReadProductBrandRepository } from '../repositories/read.repo';

export const brandProvider: Provider[] = [
  ...commandProviders,
  ...BrandMapperProviders,
  {
    provide: LOCALIZATION_SERVICE,
    useClass: LocalizationService,
  },
  {
    provide: TRANSACTION_MANAGER_SERVICE,
    useClass: TransactionManagerService,
  },
  {
    provide: BRAND_SERVICE,
    useClass: BrandService,
  },
  {
    provide: WRITE_BRAND_REPOSITORY,
    useClass: WriteProductBrandRepository,
  },
  {
    provide: READ_BRAND_REPOSITORY,
    useClass: ReadProductBrandRepository,
  },
];
