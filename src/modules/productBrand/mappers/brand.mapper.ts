import { Injectable } from '@nestjs/common';
import { CreateDto } from '../dtos/create.dto';
import { ProductBrandOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/product-brand.orm';
import { OrmEntityMethod } from '@src/common/enums/orm-entity-method.enum';
import { Timezone } from '@src/common/value-objects/timezone.vo';
import moment from 'moment';
import { DateFormat } from '@src/common/value-objects/format-date.vo';

@Injectable()
export class ProductBrandDataAccessMapper {
  toOrmEntity(dto: CreateDto, method: OrmEntityMethod): ProductBrandOrmEntity {
    const now = moment.tz(Timezone.LAOS).format(DateFormat.DATETIME_FORMAT);

    const ormEntity = new ProductBrandOrmEntity();
    ormEntity.name = dto.name;
    ormEntity.image = dto.image;

    if (method === OrmEntityMethod.CREATE) {
      ormEntity.created_at = new Date(now);
    }
    ormEntity.updated_at = new Date(now);

    return ormEntity;
  }

  toEntity(ormData: ProductBrandOrmEntity): ProductBrandOrmEntity {
    const image_url = ormData.image
      ? `${process.env.AWS_CLOUDFRONT_DISTRIBUTION_DOMAIN_NAME}/${ormData.image}`
      : '';
    return {
      id: ormData.id,
      name: ormData.name,
      image: ormData.image,
      image_url: image_url,
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
    } as unknown as ProductBrandOrmEntity;
  }
}
