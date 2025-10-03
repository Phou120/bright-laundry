import { Provider } from '@nestjs/common';
import { commandProviders } from './command.provider';
import { MapperProviders } from './mapper.provider';
import { LocalizationService } from '@src/common/infrastructure/localization/localization.service';
import {
  VILLAGE_SERVICE,
  LOCALIZATION_SERVICE,
  READ_VILLAGE_REPOSITORY,
} from '@src/common/constants/inject-key';
import { VillageService } from '../services/village.service';
import { ReadVillageRepository } from '../repositories/read.repo';

export const villageProvider: Provider[] = [
  ...commandProviders,
  ...MapperProviders,
  {
    provide: LOCALIZATION_SERVICE,
    useClass: LocalizationService,
  },
  {
    provide: READ_VILLAGE_REPOSITORY,
    useClass: ReadVillageRepository,
  },
  {
    provide: VILLAGE_SERVICE,
    useClass: VillageService,
  },
];
