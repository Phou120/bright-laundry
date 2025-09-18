import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetByIdBannerQuery } from '../get-by-id.query';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { BannerOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/banner.orm';
import { READ_BANNER_REPOSITORY } from '@src/common/constants/inject-key';
import { HttpStatus, Inject } from '@nestjs/common';
import { IReadBannerRepository } from '../../interfaces/repository.interface';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { DomainException } from '@src/common/exceptions/domain.exception';

@QueryHandler(GetByIdBannerQuery)
export class GetByIdBannerQueryHandler
  implements IQueryHandler<GetByIdBannerQuery, ResponseResult<BannerOrmEntity>>
{
  constructor(
    @Inject(READ_BANNER_REPOSITORY)
    private readonly _read: IReadBannerRepository,
  ) {}

  async execute(
    query: GetByIdBannerQuery,
  ): Promise<ResponseResult<BannerOrmEntity>> {
    if (isNaN(query.id)) {
      throw new DomainException(
        'errors.id_must_be_number',
        HttpStatus.BAD_REQUEST,
        {
          property: `id ${query.id}`,
        },
      );
    }
    await findOneOrFail(
      query.manager,
      BannerOrmEntity,
      { id: query.id },
      `${query.id}`,
    );
    return await this._read.getById(query.id, query.manager);
  }
}
