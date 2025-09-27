import { BannerOrmEntity } from './typeorms/entities/banner.orm';
import { DistrictOrmEntity } from './typeorms/entities/district.orm';
import { PaymentMethodOrmEntity } from './typeorms/entities/payment-method.orm';
import { PermissionGroupOrmEntity } from './typeorms/entities/permission-group.orm';
import { PermissionOrmEntity } from './typeorms/entities/permission.orm';
import { ProductBrandOrmEntity } from './typeorms/entities/product-brand.orm';
import { ProvinceOrmEntity } from './typeorms/entities/province.orm';
import { ReceiverAddressOrmEntity } from './typeorms/entities/receiver-address.orm';
import { RoleOrmEntity } from './typeorms/entities/role.orm';
import { RolePermissionOrmEntity } from './typeorms/entities/role_permission.orm';
import { SeederLogOrmEntity } from './typeorms/entities/seeder-log.orm';
import { StoreOpenCloseTimeOrmEntity } from './typeorms/entities/store-open-close-time.orm';
import { StoreStatusOrmEntity } from './typeorms/entities/store-status.orm';
import { StoreUserOrmEntity } from './typeorms/entities/store-user.orm';
import { StoreOrmEntity } from './typeorms/entities/store.orm';
import { SupplierOrmEntity } from './typeorms/entities/supplier.orm';
import { TagOrmEntity } from './typeorms/entities/tag.orm';
import { TaxOrmEntity } from './typeorms/entities/tax.orm';
import { UserHasPermissionOrmEntity } from './typeorms/entities/user-has-permission.orm';
import { UserOrderStatusOrmEntity } from './typeorms/entities/user-order-status.orm';
import { UserProfileOrmEntity } from './typeorms/entities/user-profile.orm';
import { UserOrmEntity } from './typeorms/entities/user.orm';
import { VillageOrmEntity } from './typeorms/entities/village.orm';

export const entities = [
  UserOrmEntity,
  SeederLogOrmEntity,
  RoleOrmEntity,
  PermissionGroupOrmEntity,
  PermissionOrmEntity,
  UserHasPermissionOrmEntity,
  UserProfileOrmEntity,
  ReceiverAddressOrmEntity,
  ProvinceOrmEntity,
  DistrictOrmEntity,
  VillageOrmEntity,
  BannerOrmEntity,
  PaymentMethodOrmEntity,
  ProductBrandOrmEntity,
  SupplierOrmEntity,
  TagOrmEntity,
  UserOrderStatusOrmEntity,
  StoreStatusOrmEntity,
  TaxOrmEntity,
  StoreOrmEntity,
  StoreUserOrmEntity,
  StoreOpenCloseTimeOrmEntity,
  RolePermissionOrmEntity,
];
