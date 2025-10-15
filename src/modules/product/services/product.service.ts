import { Injectable } from '@nestjs/common';
import { IProductServiceInterface } from '../interfaces/service.interface';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { CreateProductDto } from '../dtos/create/create.dto';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { ProductOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/product.orm';
import { CreateProductCommand } from '../commands/create-product.command';
import { ProductQueryDto } from '../dtos/query/query.dto';
import { GetAllProductsQuery } from '../queries/get-all-products.query';
import { GetProductByIdQuery } from '../queries/get-product-by-id.query';
import { UpdateProductDto } from '../dtos/create/update.dto';
import { UpdateProductCommand } from '../commands/update-product.command';
import { DeleteProductCommand } from '../commands/delete-product.command';

@Injectable()
export class ProductService implements IProductServiceInterface {
  constructor(
    private readonly _queryBus: QueryBus,
    private readonly _commandBus: CommandBus,
    @InjectEntityManager(process.env.CONNECTION_NAME)
    private readonly _readEntityManager: EntityManager,
  ) {}

  async create(
    dto: CreateProductDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<ProductOrmEntity>> {
    return await this._commandBus.execute(
      new CreateProductCommand(dto, manager ?? this._readEntityManager),
    );
  }

  async getAll(
    query: ProductQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<ProductOrmEntity>> {
    return await this._queryBus.execute(
      new GetAllProductsQuery(query, manager ?? this._readEntityManager),
    );
  }

  async getById(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<ProductOrmEntity>> {
    return await this._queryBus.execute(
      new GetProductByIdQuery(id, manager ?? this._readEntityManager),
    );
  }

  async update(
    id: number,
    dto: UpdateProductDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<ProductOrmEntity>> {
    return await this._commandBus.execute(
      new UpdateProductCommand(id, dto, manager ?? this._readEntityManager),
    );
  }

  async delete(id: number, manager?: EntityManager): Promise<void> {
    return await this._commandBus.execute(
      new DeleteProductCommand(id, manager ?? this._readEntityManager),
    );
  }
}
