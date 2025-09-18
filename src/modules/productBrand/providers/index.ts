import { Provider } from '@nestjs/common';
import { commandProviders } from './command.provider';
import { BrandMapperProviders } from './mapper.provider';
import {
  BRAND_SERVICE,
  LOCALIZATION_SERVICE,
  TRANSACTION_MANAGER_SERVICE,
} from '@src/common/constants/inject-key';
import { LocalizationService } from '@src/common/infrastructure/localization/localization.service';
import { TransactionManagerService } from '@src/common/infrastructure/transaction/transaction.service';
import { BrandService } from '../services/brand.service';

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
];
