import { Injectable } from '@nestjs/common';
import { IWriteRoleRepository } from '../../interfaces/role.interface';
import { RoleDataAccessMapper } from '../../mappers/role.mapper';
import { CreateRoleDto } from '../../dtos/create-role.dto';
import { EntityManager } from 'typeorm';
import { RoleOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/role.orm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { OrmEntityMethod } from '@src/common/enums/orm-entity-method.enum';

@Injectable()
export class WriteRoleRepository implements IWriteRoleRepository {
  constructor(private readonly _dataAccessMapper: RoleDataAccessMapper) {}

  async create(
    body: CreateRoleDto,
    manager: EntityManager,
  ): Promise<ResponseResult<RoleOrmEntity>> {
    const ormData = this._dataAccessMapper.toOrmEntity(
      body,
      OrmEntityMethod.CREATE,
    );
    return this._dataAccessMapper.toEntity(await manager.save(ormData));
  }

  async update(
    id: number,
    body: CreateRoleDto,
    manager: EntityManager,
  ): Promise<ResponseResult<RoleOrmEntity>> {
    const ormData = this._dataAccessMapper.toOrmEntity(
      body,
      OrmEntityMethod.UPDATE,
    );
    ormData.id = id;
    return this._dataAccessMapper.toEntity(await manager.save(ormData));
  }

  async delete(id: number, manager: EntityManager): Promise<void> {
    await manager.softDelete(RoleOrmEntity, id);
  }
}
