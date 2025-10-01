import { Injectable } from '@nestjs/common';
import { OrmEntityMethod } from '@src/common/enums/orm-entity-method.enum';
import { StoreOpenCloseTimeOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/store-open-close-time.orm';
import { DateFormat } from '@src/common/value-objects/format-date.vo';
import { Timezone } from '@src/common/value-objects/timezone.vo';
import moment from 'moment';
import { CreateDto } from '../../store/dtos/create/create.dto';
import { UpdateDto } from '../../store/dtos/create/update.dto';

@Injectable()
export class StoreOpenCloseTimeDataAccessMapper {
  toOrmEntity(
    store_id: number,
    dto: CreateDto | UpdateDto,
    method: OrmEntityMethod,
  ): StoreOpenCloseTimeOrmEntity {
    const now = moment.tz(Timezone.LAOS).format(DateFormat.DATETIME_FORMAT);

    const ormEntity = new StoreOpenCloseTimeOrmEntity();
    ormEntity.store_id = store_id;
    ormEntity.start_day = dto.start_day;
    ormEntity.close_day = dto.close_day;
    ormEntity.start_time = dto.start_time;
    ormEntity.end_time = dto.end_time;

    if (method === OrmEntityMethod.CREATE) {
      ormEntity.created_at = new Date(now);
    }
    ormEntity.updated_at = new Date(now);

    return ormEntity;
  }

  toEntity(ormData: StoreOpenCloseTimeOrmEntity): StoreOpenCloseTimeOrmEntity {
    return {
      id: ormData.id,
      store_id: ormData.store_id,
      start_day: ormData.start_day,
      close_day: ormData.close_day,
      start_time: ormData.start_time,
      end_time: ormData.end_time,
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
    } as unknown as StoreOpenCloseTimeOrmEntity;
  }
}
