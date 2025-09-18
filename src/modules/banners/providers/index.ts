import { Provider } from '@nestjs/common';
import { BannerMapperProviders } from './mapper.provider';
import { commandProviders } from './command.provider';
import {
  BANNER_SERVICE,
  LOCALIZATION_SERVICE,
  READ_BANNER_REPOSITORY,
  TRANSACTION_MANAGER_SERVICE,
  WRITE_BANNER_REPOSITORY,
} from '@src/common/constants/inject-key';
import { LocalizationService } from '@src/common/infrastructure/localization/localization.service';
import { TransactionManagerService } from '@src/common/infrastructure/transaction/transaction.service';
import { BannerService } from '../services/banner.service';
import { WriteBannerRepository } from '../repositories/write.repo';
import { ReadBannerRepository } from '../repositories/read.repo';

export const bannerProvider: Provider[] = [
  ...commandProviders,
  ...BannerMapperProviders,
  {
    provide: LOCALIZATION_SERVICE,
    useClass: LocalizationService,
  },
  {
    provide: TRANSACTION_MANAGER_SERVICE,
    useClass: TransactionManagerService,
  },
  {
    provide: BANNER_SERVICE,
    useClass: BannerService,
  },
  {
    provide: WRITE_BANNER_REPOSITORY,
    useClass: WriteBannerRepository,
  },
  {
    provide: READ_BANNER_REPOSITORY,
    useClass: ReadBannerRepository,
  },
];
