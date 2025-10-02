import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllProvinceQuery } from '../get-all.query';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { Inject } from '@nestjs/common';
import { READ_PROVINCE_REPOSITORY } from '@src/common/constants/inject-key';
import { ProvinceOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/province.orm';
import { IReadProvinceRepository } from '../../interfaces/repository.interface';

@QueryHandler(GetAllProvinceQuery)
export class GetAllProvinceQueryHandler
  implements
    IQueryHandler<GetAllProvinceQuery, ResponseResult<ProvinceOrmEntity>>
{
  constructor(
    @Inject(READ_PROVINCE_REPOSITORY)
    private readonly _read: IReadProvinceRepository,
  ) {}

  async execute(
    query: GetAllProvinceQuery,
  ): Promise<ResponseResult<ProvinceOrmEntity>> {
    return await this._read.getAll(query.query, query.manager);
  }
}
