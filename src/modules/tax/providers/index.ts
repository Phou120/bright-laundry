import { Provider } from '@nestjs/common';
import { commandProviders } from './command.provider';
import { MapperProviders } from './mapper.provider';
import {
  LOCALIZATION_SERVICE,
  READ_TAX_REPOSITORY,
  TAX_SERVICE,
  TRANSACTION_MANAGER_SERVICE,
  WRITE_TAX_REPOSITORY,
} from '@src/common/constants/inject-key';
import { LocalizationService } from '@src/common/infrastructure/localization/localization.service';
import { TransactionManagerService } from '@src/common/infrastructure/transaction/transaction.service';
import { TaxService } from '../services/tax.service';
import { WriteTaxRepository } from '../repositories/write.repo';
import { ReadTaxRepository } from '../repositories/read.repo';

export const taxProvider: Provider[] = [
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
    provide: TAX_SERVICE,
    useClass: TaxService,
  },
  {
    provide: WRITE_TAX_REPOSITORY,
    useClass: WriteTaxRepository,
  },
  {
    provide: READ_TAX_REPOSITORY,
    useClass: ReadTaxRepository,
  },
];
