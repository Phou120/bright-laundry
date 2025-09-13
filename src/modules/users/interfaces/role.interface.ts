import { RoleOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/role.orm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { EntityManager } from 'typeorm';
import { CreateRoleDto } from '../dtos/create-role.dto';
import { UserQueryDto } from '../dtos/query/query.dto';
import { UpdateRoleDto } from '../dtos/update-role.dto';

export interface IWriteRoleRepository {
  create(
    body: CreateRoleDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<RoleOrmEntity>>;

  update(
    id: number,
    body: UpdateRoleDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<RoleOrmEntity>>;

  delete(id: number, manager?: EntityManager): Promise<void>;
}

export interface IReadRoleRepository {
  getAll(
    query?: UserQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<RoleOrmEntity>>;

  getOne(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<RoleOrmEntity>>;
}
