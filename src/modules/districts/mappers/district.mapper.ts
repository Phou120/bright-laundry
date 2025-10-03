import { Injectable } from '@nestjs/common';
import { DistrictOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/district.orm';
import { DateFormat } from '@src/common/value-objects/format-date.vo';
import { Timezone } from '@src/common/value-objects/timezone.vo';
import moment from 'moment';

@Injectable()
export class DistrictDataAccessMapper {
  toEntity(ormEntity: DistrictOrmEntity): DistrictOrmEntity {
    const province = ormEntity.province
      ? {
          id: ormEntity.province.id,
          name: ormEntity.province.name_lo,
        }
      : null;
    return {
      id: ormEntity.id,
      name: ormEntity.name_lo,
      province_id: ormEntity.province_id,
      created_at: ormEntity.created_at
        ? moment(ormEntity.created_at)
            .tz(Timezone.LAOS)
            .format(DateFormat.DATETIME_READABLE_FORMAT)
        : null,
      updated_at: ormEntity.updated_at
        ? moment(ormEntity.updated_at)
            .tz(Timezone.LAOS)
            .format(DateFormat.DATETIME_READABLE_FORMAT)
        : null,
      province: province,
    } as unknown as DistrictOrmEntity;
  }
}
