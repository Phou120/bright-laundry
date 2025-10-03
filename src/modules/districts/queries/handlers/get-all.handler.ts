import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllDistrictQuery } from '../get-all.query';
import { DistrictOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/district.orm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { READ_DISTRICT_REPOSITORY } from '@src/common/constants/inject-key';
import { IReadDistrictRepository } from '../../interfaces/repository.interface';
import { Inject } from '@nestjs/common';

@QueryHandler(GetAllDistrictQuery)
export class GetAllDistrictHandler
  implements
    IQueryHandler<GetAllDistrictQuery, ResponseResult<DistrictOrmEntity>>
{
  constructor(
    @Inject(READ_DISTRICT_REPOSITORY)
    private readonly _repository: IReadDistrictRepository,
  ) {}

  async execute(
    query: GetAllDistrictQuery,
  ): Promise<ResponseResult<DistrictOrmEntity>> {
    const { query: queryParams, manager } = query;
    return await this._repository.getAll(queryParams, manager);
  }
}
