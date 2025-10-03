import { EntityManager } from 'typeorm';
import { DistrictQueryDto } from '../dtos/query/query.dto';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { DistrictOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/district.orm';

export interface IReadDistrictRepository {
  getAll(
    query: DistrictQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<DistrictOrmEntity>>;

  getById(
    id: number,
    manager: EntityManager,
  ): Promise<ResponseResult<DistrictOrmEntity>>;
}
