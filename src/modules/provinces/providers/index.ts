import { Provider } from '@nestjs/common';
import { commandProviders } from './command.provider';
import { MapperProviders } from './mapper.provider';
import {
  LOCALIZATION_SERVICE,
  PROVINCE_SERVICE,
  READ_PROVINCE_REPOSITORY,
} from '@src/common/constants/inject-key';
import { LocalizationService } from '@src/common/infrastructure/localization/localization.service';
import { ProvinceService } from '../services/province.service';
import { ReadProvinceRepository } from '../repositories/read.repo';

export const provinceProvider: Provider[] = [
  ...commandProviders,
  ...MapperProviders,
  {
    provide: LOCALIZATION_SERVICE,
    useClass: LocalizationService,
  },
  {
    provide: PROVINCE_SERVICE,
    useClass: ProvinceService,
  },
  {
    provide: READ_PROVINCE_REPOSITORY,
    useClass: ReadProvinceRepository,
  },
];
