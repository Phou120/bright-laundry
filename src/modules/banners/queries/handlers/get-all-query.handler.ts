import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllBannerQuery } from '../get-all.query';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { BannerOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/banner.orm';
import { READ_BANNER_REPOSITORY } from '@src/common/constants/inject-key';
import { Inject } from '@nestjs/common';
import { IReadBannerRepository } from '../../interfaces/repository.interface';

@QueryHandler(GetAllBannerQuery)
export class GetAllBannerQueryHandler
  implements IQueryHandler<GetAllBannerQuery, ResponseResult<BannerOrmEntity>>
{
  constructor(
    @Inject(READ_BANNER_REPOSITORY)
    private readonly _read: IReadBannerRepository,
  ) {}

  async execute(
    query: GetAllBannerQuery,
  ): Promise<ResponseResult<BannerOrmEntity>> {
    return await this._read.getAll(query.query, query.manager);
  }
}
