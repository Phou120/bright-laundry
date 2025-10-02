import { Injectable } from '@nestjs/common';
import { IProvinceServiceInterface } from '../interfaces/service.interface';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { EntityManager } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import { ProvinceOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/province.orm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { ProvinceQueryDto } from '../dtos/query/query.dto';
import { GetAllProvinceQuery } from '../queries/get-all.query';
import { GetByIdProvinceQuery } from '../queries/get-by-id.query';

@Injectable()
export class ProvinceService implements IProvinceServiceInterface {
  constructor(
    private readonly _queryBus: QueryBus,
    private readonly _commandBus: CommandBus,
    @InjectEntityManager(process.env.CONNECTION_NAME)
    private readonly _readEntityManager: EntityManager,
  ) {}

  async getAll(
    query: ProvinceQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<ProvinceOrmEntity>> {
    return await this._queryBus.execute(
      new GetAllProvinceQuery(query, manager ?? this._readEntityManager),
    );
  }

  async getOne(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<ProvinceOrmEntity>> {
    return await this._queryBus.execute(
      new GetByIdProvinceQuery(id, manager ?? this._readEntityManager),
    );
  }
}
