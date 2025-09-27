import { Injectable } from '@nestjs/common';
import { UpdateDto } from '../dtos/create/update.dto';
import { OrmEntityMethod } from '@src/common/enums/orm-entity-method.enum';
import { TaxOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/tax.orm';
import moment from 'moment';
import { Timezone } from '@src/common/value-objects/timezone.vo';
import { DateFormat } from '@src/common/value-objects/format-date.vo';

@Injectable()
export class TaxDataAccessMapper {
  toOrmEntity(dto: UpdateDto, method: OrmEntityMethod): TaxOrmEntity {
    const now = moment.tz(Timezone.LAOS).format(DateFormat.DATETIME_FORMAT);

    const ormEntity = new TaxOrmEntity();
    ormEntity.name = dto.name;
    ormEntity.percentage = dto.percentage;

    if (method === OrmEntityMethod.CREATE) {
      ormEntity.created_at = new Date(now);
    }
    ormEntity.updated_at = new Date(now);

    return ormEntity;
  }

  toEntity(ormData: TaxOrmEntity): TaxOrmEntity {
    return {
      id: ormData.id,
      name: ormData.name,
      percentage: ormData.percentage,
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
    } as unknown as TaxOrmEntity;
  }
}
