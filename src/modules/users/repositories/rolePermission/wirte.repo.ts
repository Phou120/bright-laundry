import { Injectable } from '@nestjs/common';
import { RolePermissionDataAccessMapper } from '../../mappers/role-permission.mapper';
import { IWriteRolePermissionRepository } from '../../interfaces/role-permission-repository.interface';
import { RolePermissionOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/role_permission.orm';
import { EntityManager } from 'typeorm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';

@Injectable()
export class WriteRolePermissionRepository
  implements IWriteRolePermissionRepository
{
  constructor(
    private readonly _dataAccessMapper: RolePermissionDataAccessMapper,
  ) {}

  async addRolePermissions(
    roleId: number,
    permissionId: number,
    manager: EntityManager,
  ): Promise<ResponseResult<RolePermissionOrmEntity>> {
    const ormData = this._dataAccessMapper.toOrmEntity(permissionId, roleId);
    return this._dataAccessMapper.toEntity(await manager.save(ormData));
  }

  async updateRolePermissions(
    roleId: number,
    permissionId: number,
    manager: EntityManager,
  ): Promise<ResponseResult<RolePermissionOrmEntity>> {
    const ormData = this._dataAccessMapper.toOrmEntity(permissionId, roleId);
    return this._dataAccessMapper.toEntity(await manager.save(ormData));
  }

  async deleteRolePermissions(
    roleId: number,
    manager: EntityManager,
  ): Promise<void> {
    await manager.delete(RolePermissionOrmEntity, { role_id: roleId });
  }
}
