import { Injectable } from '@nestjs/common';
import { IWriteBannerRepository } from '../interfaces/repository.interface';
import { BannerDataAccessMapper } from '../mappers/banner.mapper';
import { OrmEntityMethod } from '@src/common/enums/orm-entity-method.enum';
import { CreateDto } from '../dtos/create.dto';
import { EntityManager } from 'typeorm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { BannerOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/banner.orm';
import { UpdateDto } from '../dtos/update.dto';
import { UpdateOrderDto } from '../dtos/update-order.dto';

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

  async updateOrder(
    body: UpdateOrderDto,
    manager: EntityManager,
  ): Promise<ResponseResult<BannerOrmEntity[]>> {
    const updatedBanners: BannerOrmEntity[] = [];

    for (const bannerOrder of body.banner_orders) {
      const order_by = bannerOrder.order_by as unknown as number;
      await manager.update(BannerOrmEntity, bannerOrder.id, {
        order_by: order_by.toString(),
      });

      const updatedBanner = await manager.findOne(BannerOrmEntity, {
        where: { id: bannerOrder.id },
      });

      if (updatedBanner) {
        updatedBanners.push(updatedBanner);
      }
    }

    return this._dataAccessMapper.toEntityList(updatedBanners);
  }
}
