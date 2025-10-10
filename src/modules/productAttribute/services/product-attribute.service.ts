import { Injectable } from '@nestjs/common';
import { IProductAttributeServiceInterface } from '../interfaces/service.interface';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { CreateDto } from '../dtos/create/create.dto';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { ProductAttributeOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/product-attribute.orm';
import { CreateCommand } from '../commands/create.command';
import { ProductAttributeQueryDto } from '../dtos/query/query.dto';
import { GetAllQuery } from '../queries/get-all.query';
import { GetByIdQuery } from '../queries/get-by-id.query';
import { UpdateDto } from '../dtos/create/update.dto';
import { UpdateCommand } from '../commands/update.command';
import { DeleteCommand } from '../commands/delete.command';

@Injectable()
export class ProductAttributeService
  implements IProductAttributeServiceInterface
{
  constructor(
    private readonly _queryBus: QueryBus,
    private readonly _commandBus: CommandBus,
    @InjectEntityManager(process.env.CONNECTION_NAME)
    private readonly _readEntityManager: EntityManager,
  ) {}

  async create(
    dto: CreateDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<ProductAttributeOrmEntity>> {
    return await this._commandBus.execute(
      new CreateCommand(dto, manager ?? this._readEntityManager),
    );
  }

  async getAll(
    query: ProductAttributeQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<ProductAttributeOrmEntity>> {
    return await this._queryBus.execute(
      new GetAllQuery(query, manager ?? this._readEntityManager),
    );
  }

  async getById(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<ProductAttributeOrmEntity>> {
    return await this._queryBus.execute(
      new GetByIdQuery(id, manager ?? this._readEntityManager),
    );
  }

  async update(
    id: number,
    dto: UpdateDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<ProductAttributeOrmEntity>> {
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
