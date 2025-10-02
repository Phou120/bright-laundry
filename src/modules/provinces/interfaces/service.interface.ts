import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { ProvinceOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/province.orm';
import { ProvinceQueryDto } from '../dtos/query/query.dto';
import { EntityManager } from 'typeorm';

export interface IProvinceServiceInterface {
  getAll(
    query: ProvinceQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<ProvinceOrmEntity>>;
  getOne(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<ProvinceOrmEntity>>;
}
