import { Injectable } from '@nestjs/common';
import { CreateDto } from '../dtos/create/create.dto';
import { UpdateDto } from '../dtos/create/update.dto';
import { ProductAttributeOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/product-attribute.orm';
import { OrmEntityMethod } from '@src/common/enums/orm-entity-method.enum';
import { Timezone } from '@src/common/value-objects/timezone.vo';
import moment from 'moment';
import { DateFormat } from '@src/common/value-objects/format-date.vo';

@Injectable()
export class ProductAttributeDataAccessMapper {
  toOrmEntity(
    dto: CreateDto | UpdateDto,
    method: OrmEntityMethod,
  ): ProductAttributeOrmEntity {
    const now = moment.tz(Timezone.LAOS).format(DateFormat.DATETIME_FORMAT);

    const ormEntity = new ProductAttributeOrmEntity();
    if (dto.name !== undefined) ormEntity.name = dto.name;
    if (dto.store_id !== undefined) ormEntity.store_id = dto.store_id;
    if (dto.show_image !== undefined) ormEntity.show_image = dto.show_image;

    if (method === OrmEntityMethod.CREATE) {
      ormEntity.created_at = new Date(now);
    }
    ormEntity.updated_at = new Date(now);

    return ormEntity;
  }

  toEntity(ormData: ProductAttributeOrmEntity): ProductAttributeOrmEntity {
    const store = ormData.store
      ? {
          id: ormData.store.id,
          name: ormData.store.name,
          short_name: ormData.store.short_name,
          store_no: ormData.store.store_no,
        }
      : null;

    return {
      id: ormData.id,
      name: ormData.name,
      store_id: ormData.store_id,
      show_image: ormData.show_image,
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
      store: store,
    } as unknown as ProductAttributeOrmEntity;
  }
}
