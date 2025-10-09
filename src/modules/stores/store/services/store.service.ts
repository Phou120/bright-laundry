import { Injectable } from '@nestjs/common';
import { IStoreServiceInterface } from '../interfaces/service.interface';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { EntityManager } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { StoreOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/store.orm';
import { CreateDto } from '../dtos/create/create.dto';
import { CreateCommand } from '../commands/create.command';
import { StoreQueryDto } from '../dtos/query/query.dto';
import { GetAllStoreQuery } from '../queries/get-all.query';
import { GetByIdStoreQuery } from '../queries/get-by-id.query';
import { UpdateDto } from '../dtos/create/update.dto';
import { UpdateCommand } from '../commands/update.command';
import { DeleteCommand } from '../commands/delete.command';
import { UpdateStatusDto } from '../dtos/create/update-status.dto';
import { UpdateStatusCommand } from '../commands/update-status.command';

@Injectable()
export class StoreService implements IStoreServiceInterface {
  constructor(
    private readonly _queryBus: QueryBus,
    private readonly _commandBus: CommandBus,
    @InjectEntityManager(process.env.CONNECTION_NAME)
    private readonly _readEntityManager: EntityManager,
  ) {}

  async create(
    dto: CreateDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<StoreOrmEntity>> {
    return await this._commandBus.execute(
      new CreateCommand(dto, manager ?? this._readEntityManager),
    );
  }

  async getAll(
    query: StoreQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<StoreOrmEntity>> {
    return await this._queryBus.execute(
      new GetAllStoreQuery(query, manager ?? this._readEntityManager),
    );
  }

  async getById(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<StoreOrmEntity>> {
    return await this._queryBus.execute(
      new GetByIdStoreQuery(id, manager ?? this._readEntityManager),
    );
  }

  async update(
    id: number,
    dto: UpdateDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<StoreOrmEntity>> {
    return await this._commandBus.execute(
      new UpdateCommand(id, dto, manager ?? this._readEntityManager),
    );
  }

  async delete(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<StoreOrmEntity>> {
    return await this._commandBus.execute(
      new DeleteCommand(id, manager ?? this._readEntityManager),
    );
  }

  async updateStatus(
    id: number,
    dto: UpdateStatusDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<StoreOrmEntity>> {
    return await this._commandBus.execute(
      new UpdateStatusCommand(id, dto, manager ?? this._readEntityManager),
    );
  }
}
