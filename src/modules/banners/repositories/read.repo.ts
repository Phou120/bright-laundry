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
    const safeQuery: BannerQueryDto = {
      ...query,
      use_cursor: query?.use_cursor ?? false,
      sort_by: query?.sort_by ?? 'banner.id',
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
