export enum OrmEntityMethod {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
}

export enum EnumType {
  ALL = 'all',
  ADMIN = 'admin',
  USER = 'user',
}

export enum EnumReceiverAddress {
  HOME = 'home',
  OFFICE = 'office',
  OTHER = 'other',
}

export enum EnumPaymentMethod {
  ENABLE = 'enable',
  DISABLE = 'disable',
}

export enum EnumShipping {
  STORE = 'store',
  CUSTOMER = 'customer',
}

export enum EnumStoreStatus {
  PENDING = 1,
  OPEN = 2,
  CLOSE = 3,
}

export enum EnumStoreStatusString {
  PENDING = 'pending',
  OPEN = 'open',
  CLOSE = 'close',
}

export enum EligiblePersons {
  SUPER_ADMIN = 'super-admin',
  ADMIN = 'admin',
}
