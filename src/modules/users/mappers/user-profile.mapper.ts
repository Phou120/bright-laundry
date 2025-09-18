import { Injectable } from '@nestjs/common';
import { CreateDto } from '../dtos/create.dto';
import { OrmEntityMethod } from '@src/common/enums/orm-entity-method.enum';
import moment from 'moment';
import { Timezone } from '@src/common/value-objects/timezone.vo';
import { DateFormat } from '@src/common/value-objects/format-date.vo';
import { UserProfileOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/user-profile.orm';

@Injectable()
export class UserProfileDataAccessMapper {
  toOrmEntity(
    dto: CreateDto,
    method: OrmEntityMethod,
    user_id?: number,
  ): UserProfileOrmEntity {
    const now = moment.tz(Timezone.LAOS).format(DateFormat.DATETIME_FORMAT);

    const ormEntity = new UserProfileOrmEntity();
    ormEntity.image = dto.image;
    ormEntity.user_id = user_id;

    if (method === OrmEntityMethod.CREATE) {
      ormEntity.created_at = new Date(now);
    }
    ormEntity.updated_at = new Date(now);

    return ormEntity;
  }

  toEntity(ormData: UserProfileOrmEntity): UserProfileOrmEntity {
    const profile_url = ormData.image
      ? `${process.env.AWS_CLOUDFRONT_DISTRIBUTION_DOMAIN_NAME}/${ormData.image}`
      : '';

    return {
      id: ormData.id,
      image: ormData.image,
      image_url: profile_url,
      user_id: ormData.user_id,
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
    } as unknown as UserProfileOrmEntity;
  }
}
