import { Injectable } from '@nestjs/common';
import { CreateDto } from '../dtos/create.dto';
import { OrmEntityMethod } from '@src/common/enums/orm-entity-method.enum';
import { TagOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/tag.orm';
import moment from 'moment';
import { Timezone } from '@src/common/value-objects/timezone.vo';
import { DateFormat } from '@src/common/value-objects/format-date.vo';
import { UpdateDto } from '../dtos/update.dto';

@Injectable()
export class TagDataAccessMapper {
  toOrmEntity(
    dto: CreateDto | UpdateDto,
    method: OrmEntityMethod,
  ): TagOrmEntity {
    const now = moment.tz(Timezone.LAOS).format(DateFormat.DATETIME_FORMAT);

    const ormEntity = new TagOrmEntity();
    ormEntity.name = dto.name;

    if (method === OrmEntityMethod.CREATE) {
      ormEntity.created_at = new Date(now);
    }
    ormEntity.updated_at = new Date(now);

    return ormEntity;
  }

  toEntity(ormData: TagOrmEntity): TagOrmEntity {
    return {
      id: ormData.id,
      name: ormData.name,
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
    } as unknown as TagOrmEntity;
  }
}
