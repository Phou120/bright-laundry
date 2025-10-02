import { Injectable } from '@nestjs/common';
import { ProvinceOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/province.orm';
import { DateFormat } from '@src/common/value-objects/format-date.vo';
import { Timezone } from '@src/common/value-objects/timezone.vo';
import moment from 'moment';

@Injectable()
export class ProvinceDataAccessMapper {
  toEntity(ormData: ProvinceOrmEntity): ProvinceOrmEntity {
    return {
      id: ormData.id,
      name: ormData.name_lo,
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
    } as unknown as ProvinceOrmEntity;
  }
}
