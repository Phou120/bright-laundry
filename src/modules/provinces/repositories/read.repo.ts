import { Inject, Injectable } from '@nestjs/common';
import { IReadProvinceRepository } from '../interfaces/repository.interface';
import { ProvinceOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/province.orm';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { ProvinceDataAccessMapper } from '../mappers/province.mapper';
import { PAGINATION_SERVICE } from '@src/common/constants/inject-key';
import {
  FilterOptions,
  IPaginationService,
  ResponseResult,
} from '@src/common/infrastructure/pagination/pagination.interface';
import { ProvinceQueryDto } from '../dtos/query/query.dto';

@Injectable()
export class ReadProvinceRepository implements IReadProvinceRepository {
  constructor(
    @InjectRepository(ProvinceOrmEntity)
    private readonly _Orm: Repository<ProvinceOrmEntity>,
    private readonly _dataAccessMapper: ProvinceDataAccessMapper,
    @Inject(PAGINATION_SERVICE)
    private readonly _paginationService: IPaginationService,
  ) {}

  async getAll(
    query: ProvinceQueryDto,
    manager: EntityManager,
  ): Promise<ResponseResult<ProvinceOrmEntity>> {
    const queryBuilder = this.createBaseQuery(manager ?? this._Orm.manager);
    const safeQuery: ProvinceQueryDto = {
      ...query,
      use_cursor: query?.use_cursor ?? false,
      sort_by: query?.sort_by ?? 'province.id',
    };

    const data = await this._paginationService.paginate(
      queryBuilder,
      safeQuery,
      this._dataAccessMapper.toEntity.bind(this._dataAccessMapper),
      this.getFilterOptions(),
    );
    return data as ResponseResult<ProvinceOrmEntity>;
  }

  private createBaseQuery(manager: EntityManager) {
    return manager.createQueryBuilder(ProvinceOrmEntity, 'province');
  }

  private getFilterOptions(): FilterOptions {
    return {
      searchColumns: ['province.name_en', 'province.name_lo'],
      dateColumn: '',
      filterByColumns: [],
    };
  }

  async getById(
    id: number,
    manager: EntityManager,
  ): Promise<ResponseResult<ProvinceOrmEntity>> {
    const item = await this.createBaseQuery(manager ?? this._Orm.manager)
      .where('province.id = :id', { id: id })
      .getOneOrFail();
    return this._dataAccessMapper.toEntity(item);
  }
}
