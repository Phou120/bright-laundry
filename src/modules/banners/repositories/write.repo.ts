import { Injectable } from '@nestjs/common';
import { IWriteBannerRepository } from '../interfaces/repository.interface';
import { BannerDataAccessMapper } from '../mappers/banner.mapper';
import { OrmEntityMethod } from '@src/common/enums/orm-entity-method.enum';
import { CreateDto } from '../dtos/create.dto';
import { EntityManager } from 'typeorm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { BannerOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/banner.orm';
import { UpdateDto } from '../dtos/update.dto';

@Injectable()
export class WriteBannerRepository implements IWriteBannerRepository {
  constructor(private readonly _dataAccessMapper: BannerDataAccessMapper) {}

  async create(
    body: CreateDto,
    manager: EntityManager,
  ): Promise<ResponseResult<BannerOrmEntity>> {
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
  ): Promise<ResponseResult<BannerOrmEntity>> {
    const ormData = this._dataAccessMapper.toOrmEntity(
      body,
      OrmEntityMethod.UPDATE,
    );
    await manager.update(BannerOrmEntity, id, ormData);
    const found = await manager.findOne(BannerOrmEntity, { where: { id: id } });
    return this._dataAccessMapper.toEntity(found!);
  }

  async delete(id: number, manager: EntityManager): Promise<void> {
    await manager.softDelete(BannerOrmEntity, id);
  }
}
