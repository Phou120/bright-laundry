import { Injectable } from '@nestjs/common';
import { IStoreUserServiceInterface } from '../interfaces/service.interface';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { EntityManager } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { StoreUserOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/store-user.orm';
import { CreateStoreUserDto } from '../dtos/create/create.dto';
import { CreateStoreUserCommand } from '../commands/create.command';
import { StoreUserQueryDto } from '../dtos/query/query.dto';
import { GetAllStoreUserQuery } from '../queries/get-all.query';
import { GetByIdStoreUserQuery } from '../queries/get-by-id.query';
import { UpdateDto } from '../dtos/create/update.dto';
import { UpdateStoreUserCommand } from '../commands/update.command';
import { DeleteStoreUserCommand } from '../commands/delete.command';
import { CreateAdminStoreUserDto } from '../dtos/create/admin-create.dto';
import { CreateAdminStoreUserCommand } from '../commands/admin-crerate.command';

@Injectable()
export class StoreUserService implements IStoreUserServiceInterface {
  constructor(
    private readonly _queryBus: QueryBus,
    private readonly _commandBus: CommandBus,
    @InjectEntityManager(process.env.CONNECTION_NAME)
    private readonly _readEntityManager: EntityManager,
  ) {}

  async create(
    userId: number,
    dto: CreateStoreUserDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<StoreUserOrmEntity>> {
    return await this._commandBus.execute(
      new CreateStoreUserCommand(
        userId,
        dto,
        manager ?? this._readEntityManager,
      ),
    );
  }

  async getAll(
    userId: number,
    query: StoreUserQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<StoreUserOrmEntity>> {
    return await this._queryBus.execute(
      new GetAllStoreUserQuery(
        userId,
        query,
        manager ?? this._readEntityManager,
      ),
    );
  }

  async getById(
    userId: number,
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<StoreUserOrmEntity>> {
    return await this._queryBus.execute(
      new GetByIdStoreUserQuery(userId, id, manager ?? this._readEntityManager),
    );
  }

  async update(
    id: number,
    dto: UpdateDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<StoreUserOrmEntity>> {
    return await this._commandBus.execute(
      new UpdateStoreUserCommand(id, dto, manager ?? this._readEntityManager),
    );
  }

  async delete(
    userId: number,
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<void>> {
    return await this._commandBus.execute(
      new DeleteStoreUserCommand(
        userId,
        id,
        manager ?? this._readEntityManager,
      ),
    );
  }

  async adminCreate(
    dto: CreateAdminStoreUserDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<StoreUserOrmEntity>> {
    return await this._commandBus.execute(
      new CreateAdminStoreUserCommand(dto, manager ?? this._readEntityManager),
    );
  }
}
