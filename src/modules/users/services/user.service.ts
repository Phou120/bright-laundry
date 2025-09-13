import { Injectable } from '@nestjs/common';
import { IUserServiceInterface } from '../interfaces/service.interface';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { EntityManager } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import { CreateCommand } from '../commands/create.command';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { UserOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/user.orm';
import { CreateDto } from '../dtos/create.dto';
import { GetAllUserQuery } from '../queries/user.query';
import { UserQueryDto } from '../dtos/query/query.dto';
import { GetOneUserQuery } from '../queries/get-one.query';
import { UpdateDto } from '../dtos/update.dto';
import { UpdateCommand } from '../commands/update.command';
import { deleteCommand } from '../commands/delete.command';
import { CreateRoleDto } from '../dtos/create-role.dto';
import { RoleOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/role.orm';
import { CreateRoleCommand } from '../commands/role/create.command';
import { GetAllRoleQuery } from '../queries/role/get-all.query';
import { GetOneRoleQuery } from '../queries/role/get-one.query';
import { UpdateRoleCommand } from '../commands/role/update.command';
import { DeleteRoleCommand } from '../commands/role/delete.command';
import { UploadCommand } from '../commands/upload.command';
import { UploadMultipleCommand } from '../commands/upload-multiple.command';

@Injectable()
export class UserService implements IUserServiceInterface {
  constructor(
    private readonly _queryBus: QueryBus,
    private readonly _commandBus: CommandBus,
    @InjectEntityManager(process.env.CONNECTION_NAME)
    private readonly _readEntityManager: EntityManager,
  ) {}

  async create(
    body: CreateDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<UserOrmEntity>> {
    return await this._commandBus.execute(
      new CreateCommand(body, manager ?? this._readEntityManager),
    );
  }

  async getAll(
    query: UserQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<UserOrmEntity>> {
    return await this._queryBus.execute(
      new GetAllUserQuery(query, manager ?? this._readEntityManager),
    );
  }

  async getOne(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<UserOrmEntity>> {
    return await this._queryBus.execute(
      new GetOneUserQuery(id, manager ?? this._readEntityManager),
    );
  }

  async update(
    id: number,
    body: UpdateDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<UserOrmEntity>> {
    return await this._commandBus.execute(
      new UpdateCommand(id, body, manager ?? this._readEntityManager),
    );
  }

  async delete(id: number, manager?: EntityManager): Promise<void> {
    return await this._commandBus.execute(
      new deleteCommand(id, manager ?? this._readEntityManager),
    );
  }

  // CRUD role
  async createRole(
    body: CreateRoleDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<RoleOrmEntity>> {
    return await this._commandBus.execute(
      new CreateRoleCommand(body, manager ?? this._readEntityManager),
    );
  }

  async getAllRole(
    query: UserQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<RoleOrmEntity>> {
    return await this._queryBus.execute(
      new GetAllRoleQuery(query, manager ?? this._readEntityManager),
    );
  }

  async getOneRole(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<RoleOrmEntity>> {
    return await this._queryBus.execute(
      new GetOneRoleQuery(id, manager ?? this._readEntityManager),
    );
  }

  async updateRole(
    id: number,
    body: UpdateDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<RoleOrmEntity>> {
    return await this._commandBus.execute(
      new UpdateRoleCommand(id, body, manager ?? this._readEntityManager),
    );
  }

  async deleteRole(id: number, manager?: EntityManager): Promise<void> {
    return await this._commandBus.execute(
      new DeleteRoleCommand(id, manager ?? this._readEntityManager),
    );
  }

  // upload file
  async uploadFile(
    file: Express.Multer.File,
    manager?: EntityManager,
  ): Promise<{ imageUrl: string }> {
    return await this._commandBus.execute(
      new UploadCommand(file, manager ?? this._readEntityManager),
    );
  }

  async uploadFiles(
    files: Express.Multer.File[],
    manager?: EntityManager,
  ): Promise<{ imageUrls: string[] }> {
    return await this._commandBus.execute(
      new UploadMultipleCommand(files, manager ?? this._readEntityManager),
    );
  }
}
