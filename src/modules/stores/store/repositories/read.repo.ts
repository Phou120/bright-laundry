import { Inject, Injectable } from '@nestjs/common';
import { StoreOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/store.orm';
import {
  FilterOptions,
  IPaginationService,
  ResponseResult,
} from '@src/common/infrastructure/pagination/pagination.interface';
import { EntityManager, Repository } from 'typeorm';
import { IReadStoreRepository } from '../interfaces/repository.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { StoreDataAccessMapper } from '../mappers/store.mapper';
import { PAGINATION_SERVICE } from '@src/common/constants/inject-key';
import { StoreQueryDto } from '../dtos/query/query.dto';

@Injectable()
export class ReadStoreRepository implements IReadStoreRepository {
  constructor(
    @InjectRepository(StoreOrmEntity)
    private readonly _Orm: Repository<StoreOrmEntity>,
    private readonly _dataAccessMapper: StoreDataAccessMapper,
    @Inject(PAGINATION_SERVICE)
    private readonly _paginationService: IPaginationService,
  ) {}

  async getAll(
    query: StoreQueryDto,
    manager: EntityManager,
  ): Promise<ResponseResult<StoreOrmEntity>> {
    const queryBuilder = this.createBaseQuery(
      manager ?? this._Orm.manager,
      query,
    );
    const safeQuery: StoreQueryDto = {
      ...query,
      use_cursor: query?.use_cursor ?? false,
      sort_by: query?.sort_by ?? 'store.id',
    };

    // const count_item = await this.getCountItem(manager ?? this._Orm.manager);

    const data = await this._paginationService.paginate(
      queryBuilder,
      safeQuery,
      this._dataAccessMapper.toEntity.bind(this._dataAccessMapper),
      this.getFilterOptions(),
    );
    return data as ResponseResult<StoreOrmEntity>;
  }

  private createBaseQuery(manager: EntityManager, query?: StoreQueryDto) {
    const queryBuilder = manager
      .createQueryBuilder(StoreOrmEntity, 'store')
      .leftJoin('store.store_users', 'store_user')
      .leftJoin('store_user.user', 'user')
      .leftJoin('store.store_status', 'store_status')
      .leftJoin('store.village', 'village')
      .leftJoin('village.district', 'district')
      .leftJoin('district.province', 'province')
      .leftJoin('store.store_open_close_times', 'store_open_close_time')
      .addSelect([
        'store_user.id',
        'store_user.store_id',
        'store_user.user_id',
        'user.id',
        'user.email',
        'user.name',
        'user.surname',
        'store_status.id',
        'store_status.name',
        'village.id',
        'village.name_lo',
        'store_open_close_time.id',
        'store_open_close_time.start_day',
        'store_open_close_time.close_day',
        'store_open_close_time.start_time',
        'store_open_close_time.end_time',
        'district.id',
        'district.name_lo',
        'province.id',
        'province.name_lo',
      ]);

    if (query?.status) {
      queryBuilder.andWhere('store.store_status_id = :status', {
        status: query.status,
      });
    }

    return queryBuilder;
  }

  private getFilterOptions(): FilterOptions {
    return {
      searchColumns: ['store.name', 'store.public_email', 'store.phone_number'],
      dateColumn: '',
      filterByColumns: [],
    };
  }

  async getById(
    id: number,
    manager: EntityManager,
  ): Promise<ResponseResult<StoreOrmEntity>> {
    const item = await this.createBaseQuery(manager ?? this._Orm.manager)
      .where('store.id = :id', { id: id })
      .getOneOrFail();
    return this._dataAccessMapper.toEntity(item);
  }

  async getCountItem(manager: EntityManager): Promise<number> {
    const countItem = await manager
      .createQueryBuilder(StoreOrmEntity, 'store')
      .getCount();
    return countItem;
  }
}
