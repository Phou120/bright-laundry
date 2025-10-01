import { Injectable } from '@nestjs/common';
import { ICategoryServiceInterface } from '../interfaces/service.interface';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { EntityManager } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import { CreateDto } from '../dtos/create/create.dto';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { ProductCategoryOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/product-categoy.orm';
import { CreateCommand } from '../commands/create.command';

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
}
