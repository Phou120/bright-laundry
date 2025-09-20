import { Inject, Injectable } from '@nestjs/common';
import { IReadBrandRepository } from '../interfaces/repository.interface';
import { ProductBrandOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/product-brand.orm';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductBrandDataAccessMapper } from '../mappers/brand.mapper';
import {
  FilterOptions,
  IPaginationService,
  ResponseResult,
} from '@src/common/infrastructure/pagination/pagination.interface';
import { PAGINATION_SERVICE } from '@src/common/constants/inject-key';
import { ProductBrandQueryDto } from '../dtos/query/query.dto';

@Injectable()
export class ReadProductBrandRepository implements IReadBrandRepository {
  constructor(
    @InjectRepository(ProductBrandOrmEntity)
    private readonly _Orm: Repository<ProductBrandOrmEntity>,
    private readonly _dataAccessMapper: ProductBrandDataAccessMapper,
    @Inject(PAGINATION_SERVICE)
    private readonly _paginationService: IPaginationService,
  ) {}

  async getAll(
    query: ProductBrandQueryDto,
    manager: EntityManager,
  ): Promise<ResponseResult<ProductBrandOrmEntity>> {
    const queryBuilder = this.createBaseQuery(manager ?? this._Orm.manager);
    const safeQuery: ProductBrandQueryDto = {
      ...query,
      use_cursor: query?.use_cursor ?? false,
      sort_by: query?.sort_by ?? 'product_brand.id',
    };

    const data = await this._paginationService.paginate(
      queryBuilder,
      safeQuery,
      this._dataAccessMapper.toEntity.bind(this._dataAccessMapper),
      this.getFilterOptions(),
    );
    return data as ResponseResult<ProductBrandOrmEntity>;
  }

  private createBaseQuery(manager: EntityManager) {
    return manager.createQueryBuilder(ProductBrandOrmEntity, 'product_brand');
  }

  private getFilterOptions(): FilterOptions {
    return {
      searchColumns: ['product_brand.name'],
      dateColumn: '',
      filterByColumns: [],
    };
  }

  async getById(
    id: number,
    manager: EntityManager,
  ): Promise<ResponseResult<ProductBrandOrmEntity>> {
    const item = await this.createBaseQuery(manager ?? this._Orm.manager)
      .where('product_brand.id = :id', { id: id })
      .getOneOrFail();
    return this._dataAccessMapper.toEntity(item);
  }
}
