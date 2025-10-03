import { EntityManager } from 'typeorm';
import { VillageQueryDto } from '../dtos/query/query.dto';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { VillageOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/village.orm';

export interface IReadVillageRepository {
  getAll(
    query: VillageQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<VillageOrmEntity>>;

  getById(
    id: number,
    manager: EntityManager,
  ): Promise<ResponseResult<VillageOrmEntity>>;
}
