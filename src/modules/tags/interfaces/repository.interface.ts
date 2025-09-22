import { EntityManager } from 'typeorm';
import { CreateDto } from '../dtos/create.dto';
import { TagOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/tag.orm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { TagQueryDto } from '../dtos/query/query.dto';
import { UpdateDto } from '../dtos/update.dto';

export interface IWriteTagRepository {
  create(
    body: CreateDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<TagOrmEntity>>;

  update(
    id: number,
    body: UpdateDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<TagOrmEntity>>;

  delete(id: number, manager?: EntityManager): Promise<void>;
}

export interface IReadTagRepository {
  getAll(
    query: TagQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<TagOrmEntity>>;

  getOne(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<TagOrmEntity>>;
}
