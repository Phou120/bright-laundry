import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { DistrictOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/district.orm';
import { DistrictQueryDto } from '../dtos/query/query.dto';
import { EntityManager } from 'typeorm';

export interface IDistrictServiceInterface {
  getAll(
    query: DistrictQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<DistrictOrmEntity>>;
  getOne(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<DistrictOrmEntity>>;
}
