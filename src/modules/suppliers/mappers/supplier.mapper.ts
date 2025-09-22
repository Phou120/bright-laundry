import { Injectable } from '@nestjs/common';
import { CreateDto } from '../dtos/create.dto';
import { OrmEntityMethod } from '@src/common/enums/orm-entity-method.enum';
import moment from 'moment';
import { Timezone } from '@src/common/value-objects/timezone.vo';
import { DateFormat } from '@src/common/value-objects/format-date.vo';
import { SupplierOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/supplier.orm';
import { UserDataAccessMapper } from '@src/modules/users/mappers/user.mapper';
import { UserProfileDataAccessMapper } from '@src/modules/users/mappers/user-profile.mapper';

@Injectable()
export class SupplierDataAccessMapper {
  constructor(
    private readonly userDataAccessMapper: UserDataAccessMapper,
    private readonly userProfileMapper: UserProfileDataAccessMapper,
  ) {}
  toOrmEntity(
    dto: CreateDto,
    method: OrmEntityMethod,
    created_by: number,
  ): SupplierOrmEntity {
    const now = moment.tz(Timezone.LAOS).format(DateFormat.DATETIME_FORMAT);

    const ormEntity = new SupplierOrmEntity();
    ormEntity.name = dto.name;
    ormEntity.email = dto.email;
    ormEntity.company = dto.company;
    ormEntity.address = dto.address;
    ormEntity.phone_number = dto.phone_number;
    ormEntity.created_by = created_by;

    if (method === OrmEntityMethod.CREATE) {
      ormEntity.created_at = new Date(now);
    }
    ormEntity.updated_at = new Date(now);

    return ormEntity;
  }

  toEntity(ormData: SupplierOrmEntity): SupplierOrmEntity {
    return {
      id: ormData.id,
      name: ormData.name,
      email: ormData.email,
      company: ormData.company,
      address: ormData.address,
      phone_number: ormData.phone_number,
      created_by: ormData.created_by,
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
      users: ormData.users
        ? this.userDataAccessMapper.toEntity(ormData.users)
        : null,
      user_profile: ormData.users?.user_profile
        ? this.userProfileMapper.toEntity(ormData.users.user_profile)
        : null,
    } as unknown as SupplierOrmEntity;
  }
}
