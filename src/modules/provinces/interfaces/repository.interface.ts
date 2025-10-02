import { EntityManager } from 'typeorm';
import { ProvinceQueryDto } from '../dtos/query/query.dto';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { ProvinceOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/province.orm';

export interface IReadProvinceRepository {
  getAll(
    query: ProvinceQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<ProvinceOrmEntity>>;

  getById(
    id: number,
    manager: EntityManager,
  ): Promise<ResponseResult<ProvinceOrmEntity>>;
}
