import { Inject, Injectable } from '@nestjs/common';
import { IReadRoleRepository } from '../../interfaces/role.interface';
import { RoleOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/role.orm';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { RoleDataAccessMapper } from '../../mappers/role.mapper';
import {
  FilterOptions,
  IPaginationService,
  ResponseResult,
} from '@src/common/infrastructure/pagination/pagination.interface';
import { PAGINATION_SERVICE } from '@src/common/constants/inject-key';
import { UserQueryDto } from '../../dtos/query/query.dto';

@Injectable()
export class ReadRoleRepository implements IReadRoleRepository {
  constructor(
    @InjectRepository(RoleOrmEntity)
    private readonly _Orm: Repository<RoleOrmEntity>,
    private readonly _dataAccessMapper: RoleDataAccessMapper,
    @Inject(PAGINATION_SERVICE)
    private readonly _paginationService: IPaginationService,
  ) {}

  async getAll(
    query: UserQueryDto,
    manager: EntityManager,
  ): Promise<ResponseResult<RoleOrmEntity>> {
    const queryBuilder = this.createBaseQuery(manager ?? this._Orm.manager);
    const safeQuery: UserQueryDto = {
      ...query,
      use_cursor: query?.use_cursor ?? false,
      sort_by: query?.sort_by ?? 'roles.id',
    };

    const data = await this._paginationService.paginate(
      queryBuilder,
      safeQuery,
      this._dataAccessMapper.toEntity.bind(this._dataAccessMapper),
      this.getFilterOptions(),
    );
    return data as ResponseResult<RoleOrmEntity>;
  }

  private createBaseQuery(manager: EntityManager) {
    return manager
      .createQueryBuilder(RoleOrmEntity, 'roles')
      .leftJoin('roles.role_permissions', 'role_permission')
      .leftJoin('role_permission.permission', 'permission')
      .addSelect([
        'role_permission.role_id',
        'role_permission.permission_id',
        'permission.id',
        'permission.name',
        'permission.display_name',
      ]);
  }

  private getFilterOptions(): FilterOptions {
    return {
      searchColumns: ['roles.name'],
      dateColumn: '',
      filterByColumns: [],
    };
  }

  async getOne(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<RoleOrmEntity>> {
    return this._dataAccessMapper.toEntity(
      await this.createBaseQuery(manager ?? this._Orm.manager)
        .where('roles.id = :id', { id: id })
        .getOneOrFail(),
    );
  }
}
