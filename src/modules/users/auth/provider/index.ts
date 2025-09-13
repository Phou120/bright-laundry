import { Provider } from '@nestjs/common';
import { authCommandProviders } from './command.provider';
import {
  AUTH_SERVICE,
  LOCALIZATION_SERVICE,
  READ_USER_REPOSITORY,
} from '@src/common/constants/inject-key';
import { LocalizationService } from '@src/common/infrastructure/localization/localization.service';
import { AuthService } from '../services/auth.service';
import { ReadUserRepository } from '../../repositories/read.repo';

export const authProvider: Provider[] = [
  ...authCommandProviders,
  {
    provide: LOCALIZATION_SERVICE,
    useClass: LocalizationService,
  },
  {
    provide: AUTH_SERVICE,
    useClass: AuthService,
  },
  {
    provide: READ_USER_REPOSITORY,
    useClass: ReadUserRepository,
  },
];
