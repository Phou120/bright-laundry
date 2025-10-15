import { Inject, Injectable } from '@nestjs/common';
import { IReadTaxRepository } from '../interfaces/repository.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { PAGINATION_SERVICE } from '@src/common/constants/inject-key';
import { EntityManager, Repository } from 'typeorm';
import {
  FilterOptions,
  IPaginationService,
  ResponseResult,
} from '@src/common/infrastructure/pagination/pagination.interface';
import { TaxOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/tax.orm';
import { TaxDataAccessMapper } from '../mappers/tax.mapper';
import { TaxQueryDto } from '../dtos/query/query.dto';

@Injectable()
export class ReadTaxRepository implements IReadTaxRepository {
  constructor(
    @InjectRepository(TaxOrmEntity)
    private readonly _Orm: Repository<TaxOrmEntity>,
    private readonly _dataAccessMapper: TaxDataAccessMapper,
    @Inject(PAGINATION_SERVICE)
    private readonly _paginationService: IPaginationService,
  ) {}
  async findAll(
    query: TaxQueryDto,
    manager: EntityManager,
  ): Promise<ResponseResult<TaxOrmEntity>> {
    const queryBuilder = this.createBaseQuery(manager ?? this._Orm.manager);

    // Define allowed sort fields and their proper aliases
    const allowedSortFields = {
      name: 'tax.name',
      created_at: 'tax.created_at',
      updated_at: 'tax.updated_at',
    };

    // Get the requested sort_by value, or use the safe default
    let sortBy = query?.sort_by ?? 'tax.id';

    // Map the sort field to its proper alias, or use default if not allowed
    sortBy =
      allowedSortFields[sortBy as keyof typeof allowedSortFields] || 'tax.id';

    const safeQuery: TaxQueryDto = {
      ...query,
      use_cursor: query?.use_cursor ?? false,
      sort_by: sortBy,
      sort_order: query?.sort_order ?? 'DESC',
    };

    const data = await this._paginationService.paginate(
      queryBuilder,
      safeQuery,
      this._dataAccessMapper.toEntity.bind(this._dataAccessMapper),
      this.getFilterOptions(),
    );
    return data as ResponseResult<TaxOrmEntity>;
  }

  private createBaseQuery(manager: EntityManager) {
    return manager.createQueryBuilder(TaxOrmEntity, 'tax');
  }

  private getFilterOptions(): FilterOptions {
    return {
      searchColumns: ['tax.name'],
      dateColumn: '',
      filterByColumns: [],
    };
  }

  async getById(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<TaxOrmEntity>> {
    return this._dataAccessMapper.toEntity(
      await this.createBaseQuery(manager ?? this._Orm.manager)
        .where('tax.id = :id', { id: id })
        .getOneOrFail(),
    );
  }
}
