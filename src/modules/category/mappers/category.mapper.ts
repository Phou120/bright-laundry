import { Injectable } from '@nestjs/common';
import { CreateDto } from '../dtos/create/create.dto';
import { OrmEntityMethod } from '@src/common/enums/orm-entity-method.enum';
import { ProductCategoryOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/product-categoy.orm';
import moment from 'moment';
import { Timezone } from '@src/common/value-objects/timezone.vo';
import { DateFormat } from '@src/common/value-objects/format-date.vo';
import { UpdateDto } from '../dtos/create/update.dto';

@Injectable()
export class CategoryDataAccessMapper {
  toOrmEntity(
    dto: CreateDto | UpdateDto,
    method: OrmEntityMethod,
  ): ProductCategoryOrmEntity {
    const now = moment.tz(Timezone.LAOS).format(DateFormat.DATETIME_FORMAT);

    const ormEntity = new ProductCategoryOrmEntity();
    ormEntity.name = dto.name;
    ormEntity.image = dto.image;

    if (method === OrmEntityMethod.CREATE) {
      ormEntity.created_at = new Date(now);
    }
    ormEntity.updated_at = new Date(now);

    return ormEntity;
  }

  toEntity(ormData: ProductCategoryOrmEntity): ProductCategoryOrmEntity {
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
    } as unknown as ProductCategoryOrmEntity;
  }
}
