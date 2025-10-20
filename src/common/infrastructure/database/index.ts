import { BannerOrmEntity } from './typeorms/entities/banner.orm';
import { ClothesOrmEntity } from './typeorms/entities/clothe.orm';
import { CustomerOrmEntity } from './typeorms/entities/customer.orm';
import { LaundryMachineOrmEntity } from './typeorms/entities/laundry-machine.orm';
import { PermissionGroupOrmEntity } from './typeorms/entities/permission-group.orm';
import { PermissionOrmEntity } from './typeorms/entities/permission.orm';
import { RoleOrmEntity } from './typeorms/entities/role.orm';
import { RolePermissionOrmEntity } from './typeorms/entities/role_permission.orm';
import { SeederLogOrmEntity } from './typeorms/entities/seeder-log.orm';
import { StoreOpenCloseTimeOrmEntity } from './typeorms/entities/store-open-close-time.orm';
import { StoreStatusOrmEntity } from './typeorms/entities/store-status.orm';
import { StoreUserOrmEntity } from './typeorms/entities/store-user.orm';
import { StoreOrmEntity } from './typeorms/entities/store.orm';
import { TaxOrmEntity } from './typeorms/entities/tax.orm';
import { UserHasPermissionOrmEntity } from './typeorms/entities/user-has-permission.orm';
import { UserProfileOrmEntity } from './typeorms/entities/user-profile.orm';
import { UserOrmEntity } from './typeorms/entities/user.orm';
import { WashingMachineDetailOrmEntity } from './typeorms/entities/washing-machine-detail.orm';
import { WashingMachineOrmEntity } from './typeorms/entities/washing-machine.orm';

export const entities = [
  UserOrmEntity,
  SeederLogOrmEntity,
  RoleOrmEntity,
  PermissionGroupOrmEntity,
  PermissionOrmEntity,
  UserHasPermissionOrmEntity,
  UserProfileOrmEntity,
  BannerOrmEntity,
  StoreStatusOrmEntity,
  TaxOrmEntity,
  StoreOrmEntity,
  StoreUserOrmEntity,
  StoreOpenCloseTimeOrmEntity,
  RolePermissionOrmEntity,
  ClothesOrmEntity,
  CustomerOrmEntity,
  LaundryMachineOrmEntity,
  WashingMachineOrmEntity,
  WashingMachineDetailOrmEntity,
];
