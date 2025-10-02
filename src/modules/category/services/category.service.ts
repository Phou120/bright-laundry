import { Injectable } from '@nestjs/common';
import { ICategoryServiceInterface } from '../interfaces/service.interface';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { EntityManager } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import { CreateDto } from '../dtos/create/create.dto';
import { UpdateDto } from '../dtos/create/update.dto';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { ProductCategoryOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/product-categoy.orm';
import { CreateCommand } from '../commands/create.command';
import { UpdateCommand } from '../commands/update.command';
import { DeleteCommand } from '../commands/delete.command';
import { CategoryQueryDto } from '../dtos/query/query.dto';
import { GetAllQuery } from '../queries/get-all.query';
import { GetByIdQuery } from '../queries/get-by-id.query';

@Injectable()
export class CategoryService implements ICategoryServiceInterface {
  constructor(
    private readonly _queryBus: QueryBus,
    private readonly _commandBus: CommandBus,
    @InjectEntityManager(process.env.CONNECTION_NAME)
    private readonly _readEntityManager: EntityManager,
  ) {}

  async create(
    body: CreateDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<ProductCategoryOrmEntity>> {
    return await this._commandBus.execute(
      new CreateCommand(body, manager ?? this._readEntityManager),
    );
  }

  async getAll(
    query: CategoryQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<ProductCategoryOrmEntity>> {
    return await this._queryBus.execute(
      new GetAllQuery(query, manager ?? this._readEntityManager),
    );
  }

  async getById(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<ProductCategoryOrmEntity>> {
    return await this._queryBus.execute(
      new GetByIdQuery(id, manager ?? this._readEntityManager),
    );
  }

  async update(
    id: number,
    body: UpdateDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<ProductCategoryOrmEntity>> {
    return await this._commandBus.execute(
      new UpdateCommand(id, body, manager ?? this._readEntityManager),
    );
  }

  async delete(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<ProductCategoryOrmEntity>> {
    return await this._commandBus.execute(
      new DeleteCommand(id, manager ?? this._readEntityManager),
    );
  }
}
