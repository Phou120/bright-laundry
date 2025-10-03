import { Inject, Injectable } from '@nestjs/common';
import { DistrictOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/district.orm';
import { IReadDistrictRepository } from '../interfaces/repository.interface';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DistrictDataAccessMapper } from '../mappers/district.mapper';
import { PAGINATION_SERVICE } from '@src/common/constants/inject-key';
import {
  FilterOptions,
  IPaginationService,
  ResponseResult,
} from '@src/common/infrastructure/pagination/pagination.interface';
import { DistrictQueryDto } from '../dtos/query/query.dto';

@Injectable()
export class ReadDistrictRepository implements IReadDistrictRepository {
  constructor(
    @InjectRepository(DistrictOrmEntity)
    private readonly _Orm: Repository<DistrictOrmEntity>,
    private readonly _dataAccessMapper: DistrictDataAccessMapper,
    @Inject(PAGINATION_SERVICE)
    private readonly _paginationService: IPaginationService,
  ) {}

  async getAll(
    query: DistrictQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<DistrictOrmEntity>> {
    const province_id = Number(query.province_id);
    const queryBuilder = this.createBaseQuery(
      manager ?? this._Orm.manager,
      province_id,
    );
    const safeQuery: DistrictQueryDto = {
      ...query,
      use_cursor: query?.use_cursor ?? false,
      sort_by: query?.sort_by ?? 'district.id',
    };

    const data = await this._paginationService.paginate(
      queryBuilder,
      safeQuery,
      this._dataAccessMapper.toEntity.bind(this._dataAccessMapper),
      this.getFilterOptions(),
    );
    return data as ResponseResult<DistrictOrmEntity>;
  }

  private createBaseQuery(manager: EntityManager, province_id?: number) {
    const queryBuilder = manager
      .createQueryBuilder(DistrictOrmEntity, 'district')
      .leftJoin('district.province', 'province')
      .leftJoin('district.villages', 'villages')
      .addSelect(['province.id', 'province.name_lo', 'province.name_en']);

    // Apply province filter
    if (province_id) {
      queryBuilder.andWhere('district.province_id = :province_id', {
        province_id: province_id,
      });
    }

    return queryBuilder;
  }

  private getFilterOptions(): FilterOptions {
    return {
      searchColumns: ['district.name_lo', 'district.name_en'],
      dateColumn: '',
      filterByColumns: [],
    };
  }

  async getById(
    id: number,
    manager: EntityManager,
  ): Promise<ResponseResult<DistrictOrmEntity>> {
    const item = await this.createBaseQuery(manager ?? this._Orm.manager)
      .where('district.id = :id', { id: id })
      .getOneOrFail();
    return this._dataAccessMapper.toEntity(item);
  }
}
