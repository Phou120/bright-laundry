import { Injectable } from '@nestjs/common';
import { VillageOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/village.orm';
import { DateFormat } from '@src/common/value-objects/format-date.vo';
import { Timezone } from '@src/common/value-objects/timezone.vo';
import moment from 'moment';

@Injectable()
export class VillageDataAccessMapper {
  toEntity(ormEntity: VillageOrmEntity): VillageOrmEntity {
    const district = ormEntity.district
      ? {
          id: ormEntity.district.id,
          name: ormEntity.district.name_lo,
        }
      : null;
    return {
      id: ormEntity.id,
      name: ormEntity.name_lo,
      district_id: ormEntity.district_id,
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
      district: district,
    } as unknown as VillageOrmEntity;
  }
}
