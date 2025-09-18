import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { IBannerServiceInterface } from '../interfaces/service.interface';
import { BannerOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/banner.orm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { CreateDto } from '../dtos/create.dto';
import { CreateCommand } from '../commands/create.command';
import { BannerQueryDto } from '../dtos/query/query.dto';
import { GetAllBannerQuery } from '../queries/get-all.query';
import { GetByIdBannerQuery } from '../queries/get-by-id.query';
import { UpdateDto } from '../dtos/update.dto';
import { UpdateCommand } from '../commands/update.command';
import { DeleteCommand } from '../commands/delete.command';

@Injectable()
export class BannerService implements IBannerServiceInterface {
  constructor(
    private readonly _queryBus: QueryBus,
    private readonly _commandBus: CommandBus,
    @InjectEntityManager(process.env.CONNECTION_NAME)
    private readonly _readEntityManager: EntityManager,
  ) {}
  async create(
    body: CreateDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<BannerOrmEntity>> {
    return await this._commandBus.execute(
      new CreateCommand(body, manager ?? this._readEntityManager),
    );
  }

  async getAll(
    query: BannerQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<BannerOrmEntity>> {
    return await this._queryBus.execute(
      new GetAllBannerQuery(query, manager ?? this._readEntityManager),
    );
  }

  async getById(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<BannerOrmEntity>> {
    return await this._queryBus.execute(
      new GetByIdBannerQuery(id, manager ?? this._readEntityManager),
    );
  }

  async update(
    id: number,
    body: UpdateDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<BannerOrmEntity>> {
    return await this._commandBus.execute(
      new UpdateCommand(id, body, manager ?? this._readEntityManager),
    );
  }

  async delete(id: number, manager?: EntityManager): Promise<void> {
    return await this._commandBus.execute(
      new DeleteCommand(id, manager ?? this._readEntityManager),
    );
  }
}
