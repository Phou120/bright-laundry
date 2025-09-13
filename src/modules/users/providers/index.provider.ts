import { Provider } from '@nestjs/common';
import {
  LOCALIZATION_SERVICE,
  PERMISSION_SERVICE,
  READ_PERMISSION_REPOSITORY,
  READ_ROLE_REPOSITORY,
  READ_USER_REPOSITORY,
  TRANSACTION_MANAGER_SERVICE,
  USER_SERVICE,
  WRITE_ROLE_REPOSITORY,
  WRITE_USER_REPOSITORY,
} from '@src/common/constants/inject-key';
import { LocalizationService } from '@src/common/infrastructure/localization/localization.service';
import { TransactionManagerService } from '@src/common/infrastructure/transaction/transaction.service';
import { WriteUserRepository } from '../repositories/write.repo';
import { commandProviders } from './command.provider';
import { UserMapperProviders } from './mapper.provider';
import { UserService } from '../services/user.service';
import { ReadUserRepository } from '../repositories/read.repo';
import { PermissionService } from '../services/permission.service';
import { ReadPermissionRepository } from '../repositories/permission/read.repo';
import { WriteRoleRepository } from '../repositories/role/write.repo';
import { ReadRoleRepository } from '../repositories/role/read.repo';

export const userProvider: Provider[] = [
  ...commandProviders,
  ...UserMapperProviders,
  {
    provide: LOCALIZATION_SERVICE,
    useClass: LocalizationService,
  },
  {
    provide: TRANSACTION_MANAGER_SERVICE,
    useClass: TransactionManagerService,
  },
  {
    provide: USER_SERVICE,
    useClass: UserService,
  },
  {
    provide: WRITE_USER_REPOSITORY,
    useClass: WriteUserRepository,
  },
  {
    provide: READ_USER_REPOSITORY,
    useClass: ReadUserRepository,
  },
  {
    provide: PERMISSION_SERVICE,
    useClass: PermissionService,
  },
  {
    provide: READ_PERMISSION_REPOSITORY,
    useClass: ReadPermissionRepository,
  },
  {
    provide: WRITE_ROLE_REPOSITORY,
    useClass: WriteRoleRepository,
  },
  {
    provide: READ_ROLE_REPOSITORY,
    useClass: ReadRoleRepository,
  },
];
