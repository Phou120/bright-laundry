import { Inject, Injectable } from '@nestjs/common';
import { IReadStoreUserRepository } from '../interfaces/repository.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { StoreUserOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/store-user.orm';
import { EntityManager, Repository } from 'typeorm';
import { StoreUserDataAccessMapper } from '../mappers/store-user.mapper';
import { PAGINATION_SERVICE } from '@src/common/constants/inject-key';
import {
  FilterOptions,
  IPaginationService,
  ResponseResult,
} from '@src/common/infrastructure/pagination/pagination.interface';
import { StoreUserQueryDto } from '../dtos/query/query.dto';
import { EligiblePersons } from '@src/common/enums/orm-entity-method.enum';

@Injectable()
export class ReadStoreUserRepository implements IReadStoreUserRepository {
  constructor(
    @InjectRepository(StoreUserOrmEntity)
    private readonly _Orm: Repository<StoreUserOrmEntity>,
    private readonly _dataAccessMapper: StoreUserDataAccessMapper,
    @Inject(PAGINATION_SERVICE)
    private readonly _paginationService: IPaginationService,
  ) {}

  async getAll(
    query: StoreUserQueryDto,
    manager: EntityManager,
    roles?: string[],
    store_id?: number,
  ): Promise<ResponseResult<StoreUserOrmEntity>> {
    const queryBuilder = this.createBaseQuery(
      manager ?? this._Orm.manager,
      store_id,
      roles,
    );
    const safeQuery: StoreUserQueryDto = {
      ...query,
      use_cursor: query?.use_cursor ?? false,
      sort_by: query?.sort_by ?? 'store_user.id',
    };

    const data = await this._paginationService.paginate(
      queryBuilder,
      safeQuery,
      this._dataAccessMapper.toEntity.bind(this._dataAccessMapper),
      this.getFilterOptions(),
    );
    return data as ResponseResult<StoreUserOrmEntity>;
  }

  private createBaseQuery(
    manager: EntityManager,
    store_id?: number,
    roles?: string[],
  ) {
    const queryBuilder = manager
      .createQueryBuilder(StoreUserOrmEntity, 'store_user')
      .leftJoin('store_user.user', 'user')
      .leftJoin('user.user_profile', 'user_profile')
      .leftJoin('user.userHasPermissions', 'user_permission')
      .leftJoin('user_permission.permission', 'permissions')
      .leftJoinAndSelect('user.roles', 'role')
      .leftJoin('role.role_permissions', 'role_permission')
      .leftJoin('role_permission.permission', 'permission')
      .leftJoin('user.userHasPermissions', 'user_permissions')
      .leftJoin('user_permission.permission', 'userPermissions')
      .addSelect([
        'user.id',
        'user.user_no',
        'user.email',
        'user.name',
        'user.surname',
        'user.tel',
        'user_profile.id',
        'user_profile.image',
        'user_permission.permission_id',
        'permissions.id',
        'permissions.name',
        'permissions.display_name',
        'role_permission.permission_id',
        'permission.id',
        'permission.name',
        'permission.display_name',
        'user_permission.permission_id',
        'userPermissions.id',
        'userPermissions.name',
        'userPermissions.display_name',
      ]);

    if (
      roles &&
      !roles.includes(EligiblePersons.SUPER_ADMIN) &&
      !roles.includes(EligiblePersons.ADMIN)
    ) {
      queryBuilder.andWhere('store_user.store_id = :store_id', {
        store_id,
      });
    }

    return queryBuilder;
  }

  private getFilterOptions(): FilterOptions {
    return {
      searchColumns: ['user.name', 'user.email', 'user.tel', 'user.surname'],
      dateColumn: '',
      filterByColumns: [],
    };
  }

  async getById(
    id: number,
    manager: EntityManager,
  ): Promise<ResponseResult<StoreUserOrmEntity>> {
    const item = await this.createBaseQuery(manager ?? this._Orm.manager)
      .where('store_user.id = :id', { id: id })
      .getOneOrFail();
    return this._dataAccessMapper.toEntity(item);
  }
}
