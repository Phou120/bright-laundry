import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PAGINATION_SERVICE } from '@src/common/constants/inject-key';
import { PermissionGroupOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/permission-group.orm';
import {
  FilterOptions,
  IPaginationService,
  ResponseResult,
} from '@src/common/infrastructure/pagination/pagination.interface';
import { EntityManager, Repository } from 'typeorm';
import { PermissionDataAccessMapper } from '../../mappers/permission.mapper';
import { IReadPermissionRepository } from '../../interfaces/permission.interface';
import { UserQueryDto } from '../../dtos/query/query.dto';

@Injectable()
export class ReadPermissionRepository implements IReadPermissionRepository {
  constructor(
    @InjectRepository(PermissionGroupOrmEntity)
    private readonly _Orm: Repository<PermissionGroupOrmEntity>,
    private readonly _dataAccessMapper: PermissionDataAccessMapper,
    @Inject(PAGINATION_SERVICE)
    private readonly _paginationService: IPaginationService,
  ) {}
  async findAll(
    query: UserQueryDto,
    manager: EntityManager,
  ): Promise<ResponseResult<PermissionGroupOrmEntity>> {
    const queryBuilder = this.createBaseQuery(manager ?? this._Orm.manager);
    const safeQuery: UserQueryDto = {
      ...query,
      use_cursor: query?.use_cursor ?? false,
      sort_by: query?.sort_by ?? 'groups.id',
    };

    const data = await this._paginationService.paginate(
      queryBuilder,
      safeQuery,
      this._dataAccessMapper.toEntity.bind(this._dataAccessMapper),
      this.getFilterOptions(),
    );
    return data as ResponseResult<PermissionGroupOrmEntity>;
  }

  private createBaseQuery(manager: EntityManager) {
    return manager
      .createQueryBuilder(PermissionGroupOrmEntity, 'groups')
      .leftJoin('groups.permissions', 'permission')
      .addSelect([
        'permission.id',
        'permission.name',
        'permission.display_name',
      ]);
  }

  private getFilterOptions(): FilterOptions {
    return {
      searchColumns: ['users.name', 'users.surname', 'users.email'],
      dateColumn: '',
      filterByColumns: [],
    };
  }

  async getOne(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<PermissionGroupOrmEntity>> {
    const item = await this.createBaseQuery(manager ?? this._Orm.manager)
      .where('groups.id = :id', { id: id })
      .getOneOrFail();
    return this._dataAccessMapper.toEntity(item);
  }
}
