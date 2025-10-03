import { Provider } from '@nestjs/common';
import { commandProviders } from './command.provider';
import { MapperProviders } from './mapper.provider';
import { LocalizationService } from '@src/common/infrastructure/localization/localization.service';
import {
  DISTRICT_SERVICE,
  LOCALIZATION_SERVICE,
  READ_DISTRICT_REPOSITORY,
} from '@src/common/constants/inject-key';
import { DistrictService } from '../services/district.service';
import { ReadDistrictRepository } from '../repositories/read.repo';

export const districtProvider: Provider[] = [
  ...commandProviders,
  ...MapperProviders,
  {
    provide: LOCALIZATION_SERVICE,
    useClass: LocalizationService,
  },
  {
    provide: DISTRICT_SERVICE,
    useClass: DistrictService,
  },
  {
    provide: READ_DISTRICT_REPOSITORY,
    useClass: ReadDistrictRepository,
  },
];
