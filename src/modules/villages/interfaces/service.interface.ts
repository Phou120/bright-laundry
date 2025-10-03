import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { VillageOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/village.orm';
import { VillageQueryDto } from '../dtos/query/query.dto';
import { EntityManager } from 'typeorm';

export interface IVillageServiceInterface {
  getAll(
    query: VillageQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<VillageOrmEntity>>;
  getOne(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<VillageOrmEntity>>;
}
