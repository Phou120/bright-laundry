import { Inject, Injectable } from '@nestjs/common';
import { IReadProductRepository } from '../interfaces/repository.interface';
import { ProductOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/product.orm';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductDataAccessMapper } from '../mappers/product.mapper';
import {
  FilterOptions,
  IPaginationService,
  ResponseResult,
} from '@src/common/infrastructure/pagination/pagination.interface';
import { PAGINATION_SERVICE } from '@src/common/constants/inject-key';
import { ProductQueryDto } from '../dtos/query/query.dto';

@Injectable()
export class ReadProductRepository implements IReadProductRepository {
  constructor(
    @InjectRepository(ProductOrmEntity)
    private readonly _Orm: Repository<ProductOrmEntity>,
    private readonly _dataAccessMapper: ProductDataAccessMapper,
    @Inject(PAGINATION_SERVICE)
    private readonly _paginationService: IPaginationService,
  ) {}

  async getAll(
    query: ProductQueryDto,
    manager: EntityManager,
  ): Promise<ResponseResult<ProductOrmEntity>> {
    const store_id = Number(query.store_id);
    const queryBuilder = this.createBaseQuery(
      manager ?? this._Orm.manager,
      store_id,
    );
    const safeQuery: ProductQueryDto = {
      ...query,
      use_cursor: query?.use_cursor ?? false,
      sort_by: query?.sort_by ?? 'product.id',
    };

    // Apply filters
    if (query.product_type) {
      queryBuilder.andWhere('product.product_type = :product_type', {
        product_type: query.product_type,
      });
    }

    const data = await this._paginationService.paginate(
      queryBuilder,
      safeQuery,
      this._dataAccessMapper.toEntity.bind(this._dataAccessMapper),
      this.getFilterOptions(),
    );
    return data as ResponseResult<ProductOrmEntity>;
  }

  private createBaseQuery(manager: EntityManager, store_id?: number) {
    const queryBuilder = manager
      .createQueryBuilder(ProductOrmEntity, 'product')
      .leftJoinAndSelect('product.store', 'store');

    if (store_id) {
      queryBuilder.andWhere('store.id = :store_id', {
        store_id: store_id,
      });
    }
    return queryBuilder;
  }

  private getFilterOptions(): FilterOptions {
    return {
      searchColumns: ['product.name', 'product.description'],
      dateColumn: 'product.created_at',
      filterByColumns: [],
    };
  }

  async getById(
    id: number,
    manager: EntityManager,
  ): Promise<ResponseResult<ProductOrmEntity>> {
    const item = await this.createBaseQuery(manager ?? this._Orm.manager)
      .where('product.id = :id', { id: id })
      .getOneOrFail();
    return this._dataAccessMapper.toEntity(item);
  }
}
