import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from '../dtos/create-role.dto';
import { OrmEntityMethod } from '@src/common/enums/orm-entity-method.enum';
import { RoleOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/role.orm';
import moment from 'moment';
import { DateFormat } from '@src/common/value-objects/format-date.vo';
import { Timezone } from '@src/common/value-objects/timezone.vo';

@Injectable()
export class RoleDataAccessMapper {
  toOrmEntity(dto: CreateRoleDto, method: OrmEntityMethod): RoleOrmEntity {
    const now = moment.tz(Timezone.LAOS).format(DateFormat.DATETIME_FORMAT);

    const ormEntity = new RoleOrmEntity();
    ormEntity.name = dto.name;
    ormEntity.display_name = dto.display_name;

    if (method === OrmEntityMethod.CREATE) {
      ormEntity.created_at = new Date(now);
    }
    ormEntity.updated_at = new Date(now);

    return ormEntity;
  }

  toEntity(ormData: RoleOrmEntity): RoleOrmEntity {
    return {
      id: ormData.id,
      name: ormData.name,
      display_name: ormData.display_name,
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
    } as unknown as RoleOrmEntity;
  }
}
