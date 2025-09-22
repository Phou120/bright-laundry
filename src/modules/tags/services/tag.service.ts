import { Injectable } from '@nestjs/common';
import { ITagServiceInterface } from '../interfaces/service.interface';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { EntityManager } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import { TagOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/tag.orm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { CreateDto } from '../dtos/create.dto';
import { CreateCommand } from '../commands/create.command';
import { TagQueryDto } from '../dtos/query/query.dto';
import { GetAllTagQuery } from '../queries/get-all.query';
import { GetOneTagQuery } from '../queries/get-one.query';
import { UpdateDto } from '../dtos/update.dto';
import { UpdateCommand } from '../commands/update.command';
import { DeleteCommand } from '../commands/delete.command';

@Injectable()
export class TagService implements ITagServiceInterface {
  constructor(
    private readonly _queryBus: QueryBus,
    private readonly _commandBus: CommandBus,
    @InjectEntityManager(process.env.CONNECTION_NAME)
    private readonly _readEntityManager: EntityManager,
  ) {}

  async create(
    dto: CreateDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<TagOrmEntity>> {
    return await this._commandBus.execute(
      new CreateCommand(dto, manager ?? this._readEntityManager),
    );
  }

  async findAll(
    query: TagQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<TagOrmEntity>> {
    return await this._queryBus.execute(
      new GetAllTagQuery(query, manager ?? this._readEntityManager),
    );
  }

  async findOne(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<TagOrmEntity>> {
    return await this._queryBus.execute(
      new GetOneTagQuery(id, manager ?? this._readEntityManager),
    );
  }

  async update(
    id: number,
    dto: UpdateDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<TagOrmEntity>> {
    return await this._commandBus.execute(
      new UpdateCommand(id, dto, manager ?? this._readEntityManager),
    );
  }

  async delete(id: number, manager?: EntityManager): Promise<void> {
    return await this._commandBus.execute(
      new DeleteCommand(id, manager ?? this._readEntityManager),
    );
  }
}
