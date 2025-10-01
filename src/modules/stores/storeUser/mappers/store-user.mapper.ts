import { Injectable } from '@nestjs/common';
import { OrmEntityMethod } from '@src/common/enums/orm-entity-method.enum';
import { StoreUserOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/store-user.orm';
import { DateFormat } from '@src/common/value-objects/format-date.vo';
import { Timezone } from '@src/common/value-objects/timezone.vo';
import moment from 'moment';

@Injectable()
export class StoreUserDataAccessMapper {
  toOrmEntity(
    store_id: number,
    user_id: number,
    method: OrmEntityMethod,
  ): StoreUserOrmEntity {
    const now = moment.tz(Timezone.LAOS).format(DateFormat.DATETIME_FORMAT);
    const ormEntity = new StoreUserOrmEntity();
    ormEntity.store_id = store_id;
    ormEntity.user_id = user_id;

    if (method === OrmEntityMethod.CREATE) {
      ormEntity.created_at = new Date(now);
    }
    ormEntity.updated_at = new Date(now);

    return ormEntity;
  }

  toEntity(ormData: StoreUserOrmEntity): StoreUserOrmEntity {
    const user = ormData.user
      ? {
          id: ormData.user.id,
          user_no: ormData.user.user_no,
          email: ormData.user.email,
          name: ormData.user.name,
          surname: ormData.user.surname,
          tel: ormData.user.tel,
        }
      : null;
    const user_profile = ormData.user?.user_profile
      ? {
          id: ormData.user.user_profile.id,
          image: ormData.user.user_profile.image
            ? `${process.env.AWS_CLOUDFRONT_DISTRIBUTION_DOMAIN_NAME}/${ormData.user.user_profile.image}`
            : '',
        }
      : null;

    const roles = (ormData.user?.roles ?? []).map((role) => ({
      id: role.id,
      name: role.name,
      display_name: role.display_name,
      permissions:
        role.role_permissions?.map((rp) => ({
          id: rp.permission.id,
          name: rp.permission.name,
          display_name: rp.permission.display_name,
        })) ?? [],
    }));

    const permission = (ormData.user?.userHasPermissions ?? []).map((up) => ({
      id: up.permission.id,
      name: up.permission.name,
      display_name: up.permission.display_name,
    }));

    return {
      id: ormData.id,
      store_id: ormData.store_id,
      user_id: ormData.user_id,
      created_at: ormData.created_at
        ? moment(ormData.created_at)
            .tz(Timezone.LAOS)
            .format(DateFormat.DATETIME_READABLE_FORMAT)
        : null,
      updated_at: ormData.updated_at
        ? moment(ormData.updated_at)
            .tz(Timezone.LAOS)
            .format(DateFormat.DATETIME_READABLE_FORMAT)
        : null,
      user: user,
      user_profile: user_profile,
      roles: roles,
      permissions: permission,
    } as unknown as StoreUserOrmEntity;
  }
}
