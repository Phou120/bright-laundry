import { Injectable } from '@nestjs/common';
import { ITaxServiceInterface } from '../interfaces/service.interface';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { UpdateDto } from '../dtos/create/update.dto';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { TaxOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/tax.orm';
import { UpdateCommand } from '../commands/update.command';
import { TaxQueryDto } from '../dtos/query/query.dto';
import { GetAllTaxQuery } from '../queries/get-all.query';
import { GetByIdQuery } from '../queries/get-by-id.query';

@Injectable()
export class TaxService implements ITaxServiceInterface {
  constructor(
    private readonly _queryBus: QueryBus,
    private readonly _commandBus: CommandBus,
    @InjectEntityManager(process.env.CONNECTION_NAME)
    private readonly _readEntityManager: EntityManager,
  ) {}

  async update(
    id: number,
    body: UpdateDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<TaxOrmEntity>> {
    return await this._commandBus.execute(
      new UpdateCommand(id, body, manager ?? this._readEntityManager),
    );
  }

  async findAll(
    query: TaxQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<TaxOrmEntity>> {
    return await this._queryBus.execute(
      new GetAllTaxQuery(query, manager ?? this._readEntityManager),
    );
  }

  async findOne(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<TaxOrmEntity>> {
    return await this._queryBus.execute(
      new GetByIdQuery(id, manager ?? this._readEntityManager),
    );
  }
}
