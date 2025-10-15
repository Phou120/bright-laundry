import { Inject, Injectable } from '@nestjs/common';
import { BannerOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/banner.orm';
import { IReadBannerRepository } from '../interfaces/repository.interface';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BannerDataAccessMapper } from '../mappers/banner.mapper';
import { PAGINATION_SERVICE } from '@src/common/constants/inject-key';
import {
  FilterOptions,
  IPaginationService,
  ResponseResult,
} from '@src/common/infrastructure/pagination/pagination.interface';
import { BannerQueryDto } from '../dtos/query/query.dto';

@Injectable()
export class ReadBannerRepository implements IReadBannerRepository {
  constructor(
    @InjectRepository(BannerOrmEntity)
    private readonly _Orm: Repository<BannerOrmEntity>,
    private readonly _dataAccessMapper: BannerDataAccessMapper,
    @Inject(PAGINATION_SERVICE)
    private readonly _paginationService: IPaginationService,
  ) {}

  async getAll(
    query: BannerQueryDto,
    manager: EntityManager,
  ): Promise<ResponseResult<BannerOrmEntity>> {
    const queryBuilder = this.createBaseQuery(manager ?? this._Orm.manager);

    const allowedSortFields = {
      order_by: 'banner.order_by',
      created_at: 'banner.created_at',
      updated_at: 'banner.updated_at',
    };

    // Get the requested sort_by value, or use the safe default
    let sortBy = query?.sort_by ?? 'banner.id';

    // Map the sort field to its proper alias, or use default if not allowed
    sortBy =
      allowedSortFields[sortBy as keyof typeof allowedSortFields] ||
      'banner.id';

    const safeQuery: BannerQueryDto = {
      ...query,
      sort_by: sortBy,
      sort_order: query?.sort_order ?? 'DESC',
    };

    const data = await this._paginationService.paginate(
      queryBuilder,
      safeQuery,
      this._dataAccessMapper.toEntity.bind(this._dataAccessMapper),
      this.getFilterOptions(),
    );
    return data as ResponseResult<BannerOrmEntity>;
  }

  private createBaseQuery(manager: EntityManager) {
    return manager.createQueryBuilder(BannerOrmEntity, 'banner');
  }

  private getFilterOptions(): FilterOptions {
    return {
      searchColumns: [],
      dateColumn: '',
      filterByColumns: [],
    };
  }

  async getById(
    id: number,
    manager: EntityManager,
  ): Promise<ResponseResult<BannerOrmEntity>> {
    const item = await this.createBaseQuery(manager ?? this._Orm.manager)
      .where('banner.id = :id', { id: id })
      .getOneOrFail();
    return this._dataAccessMapper.toEntity(item);
  }
}
