import { ClothesOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/clothe.orm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { CreateClothesDto } from '../dtos/create.dto';
import { UpdateClothesDto } from '../dtos/update.dto';
import { ClothesQueryDto } from '../dtos/query/query.dto';
import { EntityManager } from 'typeorm';

export interface IClothesServiceInterface {
  create(
    body: CreateClothesDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<ClothesOrmEntity>>;

  getAll(
    query: ClothesQueryDto,
  ): Promise<ResponseResult<ClothesOrmEntity>>;

  getOne(
    id: number,
  ): Promise<ResponseResult<ClothesOrmEntity>>;

  update(
    id: number,
    body: UpdateClothesDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<ClothesOrmEntity>>;

  delete(
    id: number,
    manager?: EntityManager,
  ): Promise<void>;
}