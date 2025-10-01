import { Injectable } from '@nestjs/common';
import { IWriteUserPermissionRepository } from '../../interfaces/user-permission-repository.interface';
import { UserPermissionDataAccessMapper } from '../../mappers/user-permission.mapper';
import { EntityManager } from 'typeorm';
import { UserHasPermissionOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/user-has-permission.orm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';

@Injectable()
export class WriteUserPermissionRepository
  implements IWriteUserPermissionRepository
{
  constructor(
    private readonly _dataAccessMapper: UserPermissionDataAccessMapper,
  ) {}

  async create(
    userId: number,
    permissionId: number,
    manager: EntityManager,
  ): Promise<ResponseResult<UserHasPermissionOrmEntity>> {
    const ormData = this._dataAccessMapper.toOrmEntity(userId, permissionId);
    return this._dataAccessMapper.toEntity(await manager.save(ormData));
  }

  async delete(userId: number, manager: EntityManager): Promise<void> {
    await manager.delete(UserHasPermissionOrmEntity, {
      user_id: { id: userId },
    });
  }
}
