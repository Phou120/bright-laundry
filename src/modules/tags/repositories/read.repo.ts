import { Inject, Injectable } from '@nestjs/common';
import { IReadTagRepository } from '../interfaces/repository.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { TagOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/tag.orm';
import { EntityManager, Repository } from 'typeorm';
import { TagDataAccessMapper } from '../mappers/tag.mapper';
import { PAGINATION_SERVICE } from '@src/common/constants/inject-key';
import {
  FilterOptions,
  IPaginationService,
  ResponseResult,
} from '@src/common/infrastructure/pagination/pagination.interface';
import { TagQueryDto } from '../dtos/query/query.dto';

@Injectable()
export class ReadTagRepository implements IReadTagRepository {
  constructor(
    @InjectRepository(TagOrmEntity)
    private readonly _Orm: Repository<TagOrmEntity>,
    private readonly _dataAccessMapper: TagDataAccessMapper,
    @Inject(PAGINATION_SERVICE)
    private readonly _paginationService: IPaginationService,
  ) {}

  async getAll(
    query: TagQueryDto,
    manager: EntityManager,
  ): Promise<ResponseResult<TagOrmEntity>> {
    const queryBuilder = this.createBaseQuery(manager ?? this._Orm.manager);

    const allowedSortFields = {
      name: 'tag.name',
      created_at: 'tag.created_at',
      updated_at: 'tag.updated_at',
    };

    // Get the requested sort_by value, or use the safe default
    let sortBy = query?.sort_by ?? 'tag.id';

    // Map the sort field to its proper alias, or use default if not allowed
    sortBy =
      allowedSortFields[sortBy as keyof typeof allowedSortFields] || 'tag.id';

    const safeQuery: TagQueryDto = {
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
    return data as ResponseResult<TagOrmEntity>;
  }

  private createBaseQuery(manager: EntityManager) {
    return manager.createQueryBuilder(TagOrmEntity, 'tag');
  }

  private getFilterOptions(): FilterOptions {
    return {
      searchColumns: ['tag.name'],
      dateColumn: '',
      filterByColumns: [],
    };
  }

  async getOne(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<TagOrmEntity>> {
    return this._dataAccessMapper.toEntity(
      await this.createBaseQuery(manager ?? this._Orm.manager)
        .where('tag.id = :id', { id: id })
        .getOneOrFail(),
    );
  }
}
