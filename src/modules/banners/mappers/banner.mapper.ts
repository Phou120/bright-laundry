import { Injectable } from '@nestjs/common';
import { CreateDto } from '../dtos/create.dto';
import { OrmEntityMethod } from '@src/common/enums/orm-entity-method.enum';
import { BannerOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/banner.orm';
import moment from 'moment';
import { Timezone } from '@src/common/value-objects/timezone.vo';
import { DateFormat } from '@src/common/value-objects/format-date.vo';
import { UpdateDto } from '../dtos/update.dto';

@Injectable()
export class BannerDataAccessMapper {
  toOrmEntity(
    dto: CreateDto | UpdateDto,
    method: OrmEntityMethod,
  ): BannerOrmEntity {
    const now = moment.tz(Timezone.LAOS).format(DateFormat.DATETIME_FORMAT);

    const ormEntity = new BannerOrmEntity();
    ormEntity.file_banner = dto.file_banner;
    ormEntity.link = dto.link;
    ormEntity.order_by = String(dto.order_by);

    if (method === OrmEntityMethod.CREATE) {
      ormEntity.created_at = new Date(now);
    }
    ormEntity.updated_at = new Date(now);

    return ormEntity;
  }

  toEntity(ormData: BannerOrmEntity): BannerOrmEntity {
    const file_banner_url = ormData.file_banner
      ? `${process.env.AWS_CLOUDFRONT_DISTRIBUTION_DOMAIN_NAME}/${ormData.file_banner}`
      : '';
    return {
      id: ormData.id,
      file_banner: ormData.file_banner,
      file_banner_url: file_banner_url,
      link: ormData.link,
      order_by: Number(ormData.order_by),
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
    } as unknown as BannerOrmEntity;
  }
}
