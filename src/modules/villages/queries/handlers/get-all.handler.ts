import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllVillageQuery } from '../get-all.query';
import { VillageOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/village.orm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { READ_VILLAGE_REPOSITORY } from '@src/common/constants/inject-key';
import { IReadVillageRepository } from '../../interfaces/repository.interface';
import { Inject } from '@nestjs/common';

@QueryHandler(GetAllVillageQuery)
export class GetAllVillageHandler
  implements IQueryHandler<GetAllVillageQuery, ResponseResult<VillageOrmEntity>>
{
  constructor(
    @Inject(READ_VILLAGE_REPOSITORY)
    private readonly _repository: IReadVillageRepository,
  ) {}

  async execute(
    query: GetAllVillageQuery,
  ): Promise<ResponseResult<VillageOrmEntity>> {
    const { query: queryParams, manager } = query;
    return await this._repository.getAll(queryParams, manager);
  }
}
