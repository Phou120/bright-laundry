import { Injectable } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { IReadPermissionRepository } from '../interfaces/permission.interface';
import { PermissionGroupOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/permission-group.orm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { GetAllPermissionQuery } from '../queries/get-all-permission.query';
import { UserQueryDto } from '../dtos/query/query.dto';
import { GetOnePermissionQuery } from '../queries/get-one-permission.query';

@Injectable()
export class PermissionService implements IReadPermissionRepository {
  constructor(
    private readonly _queryBus: QueryBus,
    @InjectEntityManager(process.env.CONNECTION_NAME)
    private readonly _readEntityManager: EntityManager,
  ) {}
  findAll(
    query: UserQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<PermissionGroupOrmEntity>> {
    return this._queryBus.execute(
      new GetAllPermissionQuery(query, manager ?? this._readEntityManager),
    );
  }

  getOne(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<PermissionGroupOrmEntity>> {
    return this._queryBus.execute(
      new GetOnePermissionQuery(id, manager ?? this._readEntityManager),
    );
  }
}
