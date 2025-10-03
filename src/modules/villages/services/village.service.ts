import { Injectable } from '@nestjs/common';
import { IVillageServiceInterface } from '../interfaces/service.interface';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { EntityManager } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import { VillageOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/village.orm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { VillageQueryDto } from '../dtos/query/query.dto';
import { GetAllVillageQuery } from '../queries/get-all.query';
import { GetByIdVillageQuery } from '../queries/get-by-id.query';

@Injectable()
export class VillageService implements IVillageServiceInterface {
  constructor(
    private readonly _queryBus: QueryBus,
    private readonly _commandBus: CommandBus,
    @InjectEntityManager(process.env.CONNECTION_NAME)
    private readonly _readEntityManager: EntityManager,
  ) {}

  async getAll(
    query: VillageQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<VillageOrmEntity>> {
    return await this._queryBus.execute(
      new GetAllVillageQuery(query, manager ?? this._readEntityManager),
    );
  }

  async getOne(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<VillageOrmEntity>> {
    return await this._queryBus.execute(
      new GetByIdVillageQuery(id, manager ?? this._readEntityManager),
    );
  }
}
