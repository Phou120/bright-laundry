import { LaundryMachineOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/laundry-machine.orm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { CreateLaundryMachineDto } from '../dtos/create.dto';
import { UpdateLaundryMachineDto } from '../dtos/update.dto';
import { LaundryMachineQueryDto } from '../dtos/query/query.dto';
import { EntityManager } from 'typeorm';

export interface ILaundryMachineServiceInterface {
  create(
    body: CreateLaundryMachineDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<LaundryMachineOrmEntity>>;

  getAll(query: LaundryMachineQueryDto): Promise<ResponseResult<LaundryMachineOrmEntity>>;

  getOne(id: number): Promise<ResponseResult<LaundryMachineOrmEntity>>;

  update(
    id: number,
    body: UpdateLaundryMachineDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<LaundryMachineOrmEntity>>;

  delete(id: number, manager?: EntityManager): Promise<void>;
}