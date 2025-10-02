import { Inject, Injectable } from '@nestjs/common';
import { IReadCategoryRepository } from '../interfaces/repository.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductCategoryOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/product-categoy.orm';
import { EntityManager, Repository } from 'typeorm';
import { CategoryDataAccessMapper } from '../mappers/category.mapper';
import { PAGINATION_SERVICE } from '@src/common/constants/inject-key';
import {
  FilterOptions,
  IPaginationService,
  ResponseResult,
} from '@src/common/infrastructure/pagination/pagination.interface';
import { CategoryQueryDto } from '../dtos/query/query.dto';

@Injectable()
export class ReadCategoryRepository implements IReadCategoryRepository {
  constructor(
    @InjectRepository(ProductCategoryOrmEntity)
    private readonly _Orm: Repository<ProductCategoryOrmEntity>,
    private readonly _dataAccessMapper: CategoryDataAccessMapper,
    @Inject(PAGINATION_SERVICE)
    private readonly _paginationService: IPaginationService,
  ) {}

  async getAll(
    query: CategoryQueryDto,
    manager: EntityManager,
  ): Promise<ResponseResult<ProductCategoryOrmEntity>> {
    const queryBuilder = this.createBaseQuery(manager ?? this._Orm.manager);
    const safeQuery: CategoryQueryDto = {
      ...query,
      use_cursor: query?.use_cursor ?? false,
      sort_by: query?.sort_by ?? 'category.id',
    };

    const data = await this._paginationService.paginate(
      queryBuilder,
      safeQuery,
      this._dataAccessMapper.toEntity.bind(this._dataAccessMapper),
      this.getFilterOptions(),
    );
    return data as ResponseResult<ProductCategoryOrmEntity>;
  }

  async getById(
    id: number,
    manager: EntityManager,
  ): Promise<ResponseResult<ProductCategoryOrmEntity>> {
    const item = await this.createBaseQuery(manager ?? this._Orm.manager)
      .where('category.id = :id', { id: id })
      .getOneOrFail();
    return this._dataAccessMapper.toEntity(item);
  }

  private createBaseQuery(manager: EntityManager) {
    return manager.createQueryBuilder(ProductCategoryOrmEntity, 'category');
  }

  private getFilterOptions(): FilterOptions {
    return {
      searchColumns: ['category.name'],
      dateColumn: '',
      filterByColumns: [],
    };
  }
}
