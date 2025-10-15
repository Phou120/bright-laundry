import { Inject, Injectable } from '@nestjs/common';
import { IReadSupplierRepository } from '../interfaces/repository.interface';
import { SupplierOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/supplier.orm';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SupplierDataAccessMapper } from '../mappers/supplier.mapper';
import { PAGINATION_SERVICE } from '@src/common/constants/inject-key';
import {
  FilterOptions,
  IPaginationService,
  ResponseResult,
} from '@src/common/infrastructure/pagination/pagination.interface';
import { SupplierQueryDto } from '../dtos/query/query.dto';

@Injectable()
export class ReadSupplierRepository implements IReadSupplierRepository {
  constructor(
    @InjectRepository(SupplierOrmEntity)
    private readonly _Orm: Repository<SupplierOrmEntity>,
    private readonly _dataAccessMapper: SupplierDataAccessMapper,
    @Inject(PAGINATION_SERVICE)
    private readonly _paginationService: IPaginationService,
  ) {}

  async getAll(
    query: SupplierQueryDto,
    manager: EntityManager,
  ): Promise<ResponseResult<SupplierOrmEntity>> {
    const queryBuilder = this.createBaseQuery(manager ?? this._Orm.manager);

    const allowedSortFields = {
      name: 'supplier.name',
      email: 'supplier.email',
      created_at: 'supplier.created_at',
      updated_at: 'supplier.updated_at',
    };

    // Get the requested sort_by value, or use the safe default
    let sortBy = query?.sort_by ?? 'supplier.id';

    // Map the sort field to its proper alias, or use default if not allowed
    sortBy =
      allowedSortFields[sortBy as keyof typeof allowedSortFields] ||
      'supplier.id';

    const safeQuery: SupplierQueryDto = {
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
    return data as ResponseResult<SupplierOrmEntity>;
  }

  private createBaseQuery(manager: EntityManager) {
    return manager
      .createQueryBuilder(SupplierOrmEntity, 'supplier')
      .leftJoin('supplier.users', 'user')
      .leftJoin('user.user_profile', 'profile')
      .addSelect([
        'user.id',
        'user.user_no',
        'user.name',
        'user.surname',
        'user.email',
        'user.tel',
      ])
      .addSelect(['profile.id', 'profile.user_id', 'profile.image']);
  }

  private getFilterOptions(): FilterOptions {
    return {
      searchColumns: [
        'supplier.name',
        'supplier.email',
        'supplier.phone_number',
        'supplier.company',
      ],
      dateColumn: '',
      filterByColumns: [],
    };
  }

  async getById(
    id: number,
    manager: EntityManager,
  ): Promise<ResponseResult<SupplierOrmEntity>> {
    const item = await this.createBaseQuery(manager ?? this._Orm.manager)
      .where('supplier.id = :id', { id: id })
      .getOneOrFail();
    return this._dataAccessMapper.toEntity(item);
  }
}
