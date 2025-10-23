import { CustomerOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/customer.orm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { CreateCustomerDto } from '../dtos/create.dto';
import { UpdateCustomerDto } from '../dtos/update.dto';
import { CustomerQueryDto } from '../dtos/query/query.dto';
import { EntityManager } from 'typeorm';

export interface ICustomerServiceInterface {
  create(
    body: CreateCustomerDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<CustomerOrmEntity>>;

  getAll(query: CustomerQueryDto): Promise<ResponseResult<CustomerOrmEntity>>;

  getOne(id: number): Promise<ResponseResult<CustomerOrmEntity>>;

  update(
    id: number,
    body: UpdateCustomerDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<CustomerOrmEntity>>;

  delete(id: number, manager?: EntityManager): Promise<void>;
}