import { Injectable } from '@nestjs/common';
import { IWriteTagRepository } from '../interfaces/repository.interface';
import { CreateDto } from '../dtos/create.dto';
import { EntityManager } from 'typeorm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { TagOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/tag.orm';
import { TagDataAccessMapper } from '../mappers/tag.mapper';
import { OrmEntityMethod } from '@src/common/enums/orm-entity-method.enum';
import { UpdateDto } from '../dtos/update.dto';

@Injectable()
export class WriteTagRepository implements IWriteTagRepository {
  constructor(private readonly _dataAccessMapper: TagDataAccessMapper) {}

  async create(
    body: CreateDto,
    manager: EntityManager,
  ): Promise<ResponseResult<TagOrmEntity>> {
    const ormData = this._dataAccessMapper.toOrmEntity(
      body,
      OrmEntityMethod.CREATE,
    );
    return this._dataAccessMapper.toEntity(await manager.save(ormData));
  }

  async update(
    id: number,
    body: UpdateDto,
    manager: EntityManager,
  ): Promise<ResponseResult<TagOrmEntity>> {
    const ormData = this._dataAccessMapper.toOrmEntity(
      body,
      OrmEntityMethod.UPDATE,
    );
    ormData.id = id;
    return this._dataAccessMapper.toEntity(await manager.save(ormData));
  }

  async delete(id: number, manager: EntityManager): Promise<void> {
    await manager.delete(TagOrmEntity, id);
  }
}
