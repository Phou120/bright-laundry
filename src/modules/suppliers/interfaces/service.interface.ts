import { SupplierOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/supplier.orm';
import { CreateDto } from '../dtos/create.dto';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { EntityManager } from 'typeorm';
import { SupplierQueryDto } from '../dtos/query/query.dto';
import { UpdateDto } from '../dtos/update.dto';

export interface ISupplierServiceInterface {
  create(
    dto: CreateDto,
    created_by: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<SupplierOrmEntity>>;

  findAll(
    query: SupplierQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<SupplierOrmEntity>>;

  findById(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<SupplierOrmEntity>>;

  update(
    id: number,
    dto: UpdateDto,
    user_id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<SupplierOrmEntity>>;

  delete(id: number, manager?: EntityManager): Promise<void>;
}
