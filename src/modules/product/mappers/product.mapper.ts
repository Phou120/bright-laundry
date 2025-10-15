import { Injectable } from '@nestjs/common';
import { ProductOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/product.orm';
import { OrmEntityMethod } from '@src/common/enums/orm-entity-method.enum';
import { Timezone } from '@src/common/value-objects/timezone.vo';
import moment from 'moment';
import { DateFormat } from '@src/common/value-objects/format-date.vo';
import { CreateProductDto } from '../dtos/create/create.dto';

@Injectable()
export class ProductDataAccessMapper {
  toOrmEntity(
    // dto: CreateProductDto | UpdateProductDto,
    dto: CreateProductDto,
    method: OrmEntityMethod,
  ): ProductOrmEntity {
    const now = moment.tz(Timezone.LAOS).format(DateFormat.DATETIME_FORMAT);

    const ormEntity = new ProductOrmEntity();
    if (dto.name !== undefined) ormEntity.name = dto.name;
    if (dto.description !== undefined) ormEntity.description = dto.description;
    if (dto.product_type !== undefined)
      ormEntity.product_type = dto.product_type;
    if (dto.store_id !== undefined) ormEntity.store_id = dto.store_id;

    if (method === OrmEntityMethod.CREATE) {
      ormEntity.created_at = new Date(now);
    }
    ormEntity.updated_at = new Date(now);

    return ormEntity;
  }

  toEntity(ormData: ProductOrmEntity): ProductOrmEntity {
    const store = ormData.store
      ? { ...ormData.store } // Get all properties
      : null;

    return {
      id: ormData.id,
      name: ormData.name,
      description: ormData.description,
      product_type: ormData.product_type,
      store_id: ormData.store_id,
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
      deleted_at: ormData.deleted_at
        ? moment(ormData.deleted_at)
            .tz(Timezone.LAOS)
            .format(DateFormat.DATETIME_READABLE_FORMAT)
        : null,
      store: store,
    } as unknown as ProductOrmEntity;
  }
}
