import { Provider } from '@nestjs/common';
import { commandProviders } from './command.provider';
import { MapperProviders } from './mapper.provider';
import {
  LOCALIZATION_SERVICE,
  READ_SUPPLIER_REPOSITORY,
  SUPPLIER_SERVICE,
  TRANSACTION_MANAGER_SERVICE,
  WRITE_SUPPLIER_REPOSITORY,
} from '@src/common/constants/inject-key';
import { LocalizationService } from '@src/common/infrastructure/localization/localization.service';
import { TransactionManagerService } from '@src/common/infrastructure/transaction/transaction.service';
import { SupplierService } from '../services/supplier.service';
import { WriteSupplierRepository } from '../repositories/write.repo';
import { ReadSupplierRepository } from '../repositories/read.repo';

export const supplierProvider: Provider[] = [
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
    provide: SUPPLIER_SERVICE,
    useClass: SupplierService,
  },
  {
    provide: WRITE_SUPPLIER_REPOSITORY,
    useClass: WriteSupplierRepository,
  },
  {
    provide: READ_SUPPLIER_REPOSITORY,
    useClass: ReadSupplierRepository,
  },
];
