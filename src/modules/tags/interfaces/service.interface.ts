import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { CreateDto } from '../dtos/create.dto';
import { TagOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/tag.orm';
import { EntityManager } from 'typeorm';
import { TagQueryDto } from '../dtos/query/query.dto';
import { UpdateDto } from '../dtos/update.dto';

export interface ITagServiceInterface {
  create(
    dto: CreateDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<TagOrmEntity>>;

  findAll(
    query: TagQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<TagOrmEntity>>;

  findOne(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<TagOrmEntity>>;

  update(
    id: number,
    dto: UpdateDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<TagOrmEntity>>;

  delete(id: number, manager?: EntityManager): Promise<void>;
}
