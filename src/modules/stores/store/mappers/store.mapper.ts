import { Injectable } from '@nestjs/common';
import {
  EnumStoreStatus,
  OrmEntityMethod,
} from '@src/common/enums/orm-entity-method.enum';
import { StoreOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/store.orm';
import { DateFormat } from '@src/common/value-objects/format-date.vo';
import { Timezone } from '@src/common/value-objects/timezone.vo';
import moment from 'moment';
import { CreateDto } from '../dtos/create/create.dto';
import { UpdateDto } from '../dtos/create/update.dto';

@Injectable()
export class StoreDataAccessMapper {
  toOrmEntity(
    dto: CreateDto | UpdateDto,
    method: OrmEntityMethod,
    tax_id?: number,
  ): StoreOrmEntity {
    const now = moment.tz(Timezone.LAOS).format(DateFormat.DATETIME_FORMAT);

    const ormEntity = new StoreOrmEntity();
    ormEntity.store_no = dto.store_code;
    ormEntity.name = dto.store_name;
    ormEntity.image = dto.image;
    ormEntity.short_name = dto.short_name;
    ormEntity.address = dto.address;
    ormEntity.phone_number = dto.phone_number;
    ormEntity.public_email = dto.public_email;
    ormEntity.latitude = dto.latitude;
    ormEntity.longitude = dto.longitude;
    ormEntity.bank_name = dto.bank_name;
    ormEntity.account_number = dto.account_number;
    ormEntity.description = dto.description;
    ormEntity.policy = dto.policy;
    ormEntity.village_id = dto.village_id;
    ormEntity.store_status_id = EnumStoreStatus.PENDING;

    if (method === OrmEntityMethod.CREATE) {
      if (tax_id) {
        ormEntity.tax_id = tax_id;
      }
      ormEntity.created_at = new Date(now);
    }
    ormEntity.updated_at = new Date(now);

    return ormEntity;
  }

  toEntity(ormData: StoreOrmEntity): StoreOrmEntity {
    const image_url = ormData.image
      ? `${process.env.AWS_CLOUDFRONT_DISTRIBUTION_DOMAIN_NAME}/${ormData.image}`
      : '';
    const user = ormData.store_users?.length
      ? {
          id: ormData.store_users[0].user.id,
          email: ormData.store_users[0].user.email,
          name: ormData.store_users[0].user.name,
        }
      : null;

    const store_status = ormData.store_status
      ? {
          id: ormData.store_status.id,
          name: ormData.store_status.name,
        }
      : null;

    const open_close_time = ormData.store_open_close_times
      ? ormData.store_open_close_times.map((time) => ({
          id: time.id,
          start_day: time.start_day,
          close_day: time.close_day,
          start_time: time.start_time,
          end_time: time.end_time,
        }))
      : null;

    const village = ormData.village
      ? {
          id: ormData.village.id,
          name: ormData.village.name,
        }
      : null;

    return {
      id: ormData.id,
      name: ormData.name,
      image: ormData.image,
      image_url: image_url,
      short_name: ormData.short_name + '' + ormData.store_no,
      address: ormData.address,
      phone_number: ormData.phone_number,
      public_email: ormData.public_email,
      latitude: ormData.latitude,
      longitude: ormData.longitude,
      bank_name: ormData.bank_name,
      account_number: ormData.account_number,
      description: ormData.description,
      policy: ormData.policy,
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
      store_status: store_status,
      village: village,
      open_close_time: open_close_time,
    } as unknown as StoreOrmEntity;
  }
}
