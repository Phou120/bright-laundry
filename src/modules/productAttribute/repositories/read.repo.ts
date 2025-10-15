import { Inject, Injectable } from '@nestjs/common';
import { IReadProductAttributeRepository } from '../interfaces/repository.interface';
import { ProductAttributeOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/product-attribute.orm';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductAttributeDataAccessMapper } from '../mappers/product-attribute.mapper';
import {
  FilterOptions,
  IPaginationService,
  ResponseResult,
} from '@src/common/infrastructure/pagination/pagination.interface';
import { PAGINATION_SERVICE } from '@src/common/constants/inject-key';
import { ProductAttributeQueryDto } from '../dtos/query/query.dto';

@Injectable()
export class ReadProductAttributeRepository
  implements IReadProductAttributeRepository
{
  constructor(
    @InjectRepository(ProductAttributeOrmEntity)
    private readonly _Orm: Repository<ProductAttributeOrmEntity>,
    private readonly _dataAccessMapper: ProductAttributeDataAccessMapper,
    @Inject(PAGINATION_SERVICE)
    private readonly _paginationService: IPaginationService,
  ) {}

  async getAll(
    query: ProductAttributeQueryDto,
    manager: EntityManager,
  ): Promise<ResponseResult<ProductAttributeOrmEntity>> {
    const store_id = Number(query.store_id);
    const queryBuilder = this.createBaseQuery(
      manager ?? this._Orm.manager,
      store_id,
    );

    const allowedSortFields = {
      name: 'product_attribute.name',
      created_at: 'product_attribute.created_at',
      updated_at: 'product_attribute.updated_at',
    };

    // Get the requested sort_by value, or use the safe default
    let sortBy = query?.sort_by ?? 'product_attribute.id';

    // Map the sort field to its proper alias, or use default if not allowed
    sortBy =
      allowedSortFields[sortBy as keyof typeof allowedSortFields] ||
      'product_attribute.id';

    const safeQuery: ProductAttributeQueryDto = {
      ...query,
      sort_by: sortBy,
      sort_order: query?.sort_order ?? 'DESC',
    };

    // Apply filters

    const data = await this._paginationService.paginate(
      queryBuilder,
      safeQuery,
      this._dataAccessMapper.toEntity.bind(this._dataAccessMapper),
      this.getFilterOptions(),
    );
    return data as ResponseResult<ProductAttributeOrmEntity>;
  }

  private createBaseQuery(manager: EntityManager, store_id?: number) {
    const queryBuilder = manager
      .createQueryBuilder(ProductAttributeOrmEntity, 'product_attribute')
      .leftJoinAndSelect('product_attribute.store', 'store');

    if (store_id) {
      queryBuilder.andWhere('store.id = :store_id', {
        store_id: store_id,
      });
    }
    return queryBuilder;
  }

  private getFilterOptions(): FilterOptions {
    return {
      searchColumns: ['product_attribute.name'],
      dateColumn: '',
      filterByColumns: [],
    };
  }

  async getById(
    id: number,
    manager: EntityManager,
  ): Promise<ResponseResult<ProductAttributeOrmEntity>> {
    const item = await this.createBaseQuery(manager ?? this._Orm.manager)
      .where('product_attribute.id = :id', { id: id })
      .getOneOrFail();
    return this._dataAccessMapper.toEntity(item);
  }
}
