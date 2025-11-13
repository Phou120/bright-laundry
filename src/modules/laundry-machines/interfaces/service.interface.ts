import { WashingMachineOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/washing-machine.orm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { CreateLaundryMachineDto } from '../dtos/create.dto';
import { UpdateLaundryMachineDto } from '../dtos/update.dto';
import { LaundryMachineQueryDto } from '../dtos/query/query.dto';
import { EntityManager } from 'typeorm';
import { WashingMachineDetailOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/washing-machine-detail.orm';

export interface ILaundryMachineServiceInterface {
  create(
    userId: number,
    body: CreateLaundryMachineDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<WashingMachineOrmEntity>>;

  getAll(
    query: LaundryMachineQueryDto,
  ): Promise<ResponseResult<WashingMachineOrmEntity>>;

  getOne(
    id: number,
    include?: string,
  ): Promise<ResponseResult<WashingMachineOrmEntity>>;

  update(
    id: number,
    body: UpdateLaundryMachineDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<WashingMachineOrmEntity>>;

  delete(id: number, manager?: EntityManager): Promise<void>;

  // Detail operations
  addDetail(
    washingMachineId: number,
    detailData: any,
    manager?: EntityManager,
  ): Promise<ResponseResult<WashingMachineDetailOrmEntity>>;

  updateDetail(
    detailId: number,
    detailData: any,
    manager?: EntityManager,
  ): Promise<ResponseResult<WashingMachineDetailOrmEntity>>;

  removeDetail(detailId: number, manager?: EntityManager): Promise<void>;
}
