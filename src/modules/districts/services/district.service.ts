import { Injectable } from '@nestjs/common';
import { IDistrictServiceInterface } from '../interfaces/service.interface';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { EntityManager } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import { DistrictOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/district.orm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { DistrictQueryDto } from '../dtos/query/query.dto';
import { GetAllDistrictQuery } from '../queries/get-all.query';
import { GetByIdDistrictQuery } from '../queries/get-by-id.query';

@Injectable()
export class DistrictService implements IDistrictServiceInterface {
  constructor(
    private readonly _queryBus: QueryBus,
    private readonly _commandBus: CommandBus,
    @InjectEntityManager(process.env.CONNECTION_NAME)
    private readonly _readEntityManager: EntityManager,
  ) {}

  async getAll(
    query: DistrictQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<DistrictOrmEntity>> {
    return await this._queryBus.execute(
      new GetAllDistrictQuery(query, manager ?? this._readEntityManager),
    );
  }

  async getOne(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<DistrictOrmEntity>> {
    return await this._queryBus.execute(
      new GetByIdDistrictQuery(id, manager ?? this._readEntityManager),
    );
  }
}
