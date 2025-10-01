import { Injectable } from '@nestjs/common';
import { OrmEntityMethod } from '@src/common/enums/orm-entity-method.enum';
import { UserOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/user.orm';
import { DateFormat } from '@src/common/value-objects/format-date.vo';
import { Timezone } from '@src/common/value-objects/timezone.vo';
import moment from 'moment-timezone';
import { CreateDto } from '../dtos/create.dto';
import { UserProfileDataAccessMapper } from './user-profile.mapper';
import { ChangePasswordDto } from '../dtos/change-password.dto';
import { UpdateDto } from '../dtos/update.dto';

@Injectable()
export class UserDataAccessMapper {
  constructor(
    private readonly userProfileMapper: UserProfileDataAccessMapper,
  ) {}
  toOrmEntity(
    userEntity: CreateDto,
    method: OrmEntityMethod,
    password?: string,
    code?: string,
  ): UserOrmEntity {
    const now = moment.tz(Timezone.LAOS).format(DateFormat.DATETIME_FORMAT);

    const ormEntity = new UserOrmEntity();
    ormEntity.user_no = code;
    ormEntity.name = userEntity.name;
    ormEntity.surname = userEntity.surname;
    ormEntity.email = userEntity.email;
    ormEntity.password = password;
    ormEntity.tel = userEntity.tel;

    if (method === OrmEntityMethod.CREATE) {
      ormEntity.created_at = new Date(now);
    }
    ormEntity.updated_at = new Date(now);

    return ormEntity;
  }

  toOrmEntityToChangePassword(userEntity: ChangePasswordDto): UserOrmEntity {
    const now = moment.tz(Timezone.LAOS).format(DateFormat.DATETIME_FORMAT);

    const ormEntity = new UserOrmEntity();
    ormEntity.password = userEntity.new_password;
    ormEntity.updated_at = new Date(now);

    return ormEntity;
  }

  toOrmEntityToStoreUser(
    userEntity: UpdateDto,
    password?: string,
  ): UserOrmEntity {
    const now = moment.tz(Timezone.LAOS).format(DateFormat.DATETIME_FORMAT);

    const ormEntity = new UserOrmEntity();
    ormEntity.name = userEntity.name;
    ormEntity.email = userEntity.email;
    ormEntity.tel = userEntity.tel;
    ormEntity.surname = userEntity.surname;
    if (password) {
      ormEntity.password = password;
    }
    ormEntity.updated_at = new Date(now);

    return ormEntity;
  }

  toEntity(ormData: UserOrmEntity): UserOrmEntity {
    const permission = ormData.userHasPermissions?.map(
      (perm) => perm.permission,
    );

    const profile = ormData.user_profile
      ? this.userProfileMapper.toEntity(ormData.user_profile)
      : null;

    const data = {
      id: ormData.id,
      user_no: ormData.user_no,
      name: ormData.name,
      surname: ormData.surname,
      email: ormData.email,
      tel: ormData.tel,
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
      profile: profile,
      roles: ormData.roles,
      permissions: permission || [],
    } as unknown as UserOrmEntity;

    return data;
  }
}
