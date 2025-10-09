import { Inject, Injectable } from '@nestjs/common';
import { VillageOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/village.orm';
import { IReadVillageRepository } from '../interfaces/repository.interface';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { VillageDataAccessMapper } from '../mappers/village.mapper';
import { PAGINATION_SERVICE } from '@src/common/constants/inject-key';
import {
  FilterOptions,
  IPaginationService,
  ResponseResult,
} from '@src/common/infrastructure/pagination/pagination.interface';
import { VillageQueryDto } from '../dtos/query/query.dto';

@Injectable()
export class ReadVillageRepository implements IReadVillageRepository {
  constructor(
    @InjectRepository(VillageOrmEntity)
    private readonly _Orm: Repository<VillageOrmEntity>,
    private readonly _dataAccessMapper: VillageDataAccessMapper,
    @Inject(PAGINATION_SERVICE)
    private readonly _paginationService: IPaginationService,
  ) {}

  async getAll(
    query: VillageQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<VillageOrmEntity>> {
    const district_id = Number(query.district_id);
    const queryBuilder = this.createBaseQuery(
      manager ?? this._Orm.manager,
      district_id,
    );
    const safeQuery: VillageQueryDto = {
      ...query,
      use_cursor: query?.use_cursor ?? false,
      sort_by: query?.sort_by ?? 'village.id',
    };

    const data = await this._paginationService.paginate(
      queryBuilder,
      safeQuery,
      this._dataAccessMapper.toEntity.bind(this._dataAccessMapper),
      this.getFilterOptions(),
    );
    return data as ResponseResult<VillageOrmEntity>;
  }

  private createBaseQuery(manager: EntityManager, district_id?: number) {
    const queryBuilder = manager
      .createQueryBuilder(VillageOrmEntity, 'village')
      .leftJoin('village.district', 'district')
      .leftJoin('district.province', 'province')
      .addSelect([
        'district.id',
        'district.name_lo',
        'district.name_en',
        'province.id',
        'province.name_lo',
        'province.name_en',
      ]);

    // Apply district filter
    if (district_id) {
      queryBuilder.andWhere('village.district_id = :district_id', {
        district_id: district_id,
      });
    }

    return queryBuilder;
  }

  private getFilterOptions(): FilterOptions {
    return {
      searchColumns: ['village.name_lo', 'village.name_en'],
      dateColumn: '',
      filterByColumns: [],
    };
  }

  async getById(
    id: number,
    manager: EntityManager,
  ): Promise<ResponseResult<VillageOrmEntity>> {
    const item = await this.createBaseQuery(manager ?? this._Orm.manager)
      .where('village.id = :id', { id: id })
      .getOneOrFail();
    return this._dataAccessMapper.toEntity(item);
  }
}
