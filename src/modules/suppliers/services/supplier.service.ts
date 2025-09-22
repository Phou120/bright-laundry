import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { EntityManager } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import { CreateDto } from '../dtos/create.dto';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { SupplierOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/supplier.orm';
import { CreateCommand } from '../commands/create.command';
import { ISupplierServiceInterface } from '../interfaces/service.interface';
import { SupplierQueryDto } from '../dtos/query/query.dto';
import { GetAllQuery } from '../queries/get-all.query';
import { GetByIdQuery } from '../queries/get-by-id.query';
import { UpdateDto } from '../dtos/update.dto';
import { UpdateCommand } from '../commands/update.command';
import { DeleteCommand } from '../commands/delete.command';

@Injectable()
export class SupplierService implements ISupplierServiceInterface {
  constructor(
    private readonly _queryBus: QueryBus,
    private readonly _commandBus: CommandBus,
    @InjectEntityManager(process.env.CONNECTION_NAME)
    private readonly _readEntityManager: EntityManager,
  ) {}

  async create(
    dto: CreateDto,
    created_by: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<SupplierOrmEntity>> {
    return await this._commandBus.execute(
      new CreateCommand(dto, manager ?? this._readEntityManager, created_by),
    );
  }

  async findAll(
    query: SupplierQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<SupplierOrmEntity>> {
    return await this._queryBus.execute(
      new GetAllQuery(query, manager ?? this._readEntityManager),
    );
  }

  async findById(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<SupplierOrmEntity>> {
    return await this._queryBus.execute(
      new GetByIdQuery(id, manager ?? this._readEntityManager),
    );
  }

  async update(
    id: number,
    dto: UpdateDto,
    user_id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<SupplierOrmEntity>> {
    return await this._commandBus.execute(
      new UpdateCommand(id, dto, user_id, manager ?? this._readEntityManager),
    );
  }

  async delete(id: number, manager?: EntityManager): Promise<void> {
    return await this._commandBus.execute(
      new DeleteCommand(id, manager ?? this._readEntityManager),
    );
  }
}
