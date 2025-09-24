import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { IReadUserRepository } from '../interfaces/repository.interface';
import { UserDataAccessMapper } from '../mappers/user.mapper';
import { EntityManager, Repository } from 'typeorm';
import {
  FilterOptions,
  IPaginationService,
  ResponseResult,
} from '@src/common/infrastructure/pagination/pagination.interface';
import { UserOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/user.orm';
import { InjectRepository } from '@nestjs/typeorm';
import { PAGINATION_SERVICE } from '@src/common/constants/inject-key';
import { UserQueryDto } from '../dtos/query/query.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthDto } from '../auth/dtos/auth.dto';
import { DomainException } from '@src/common/exceptions/domain.exception';

@Injectable()
export class ReadUserRepository implements IReadUserRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly _Orm: Repository<UserOrmEntity>,
    private readonly _dataAccessMapper: UserDataAccessMapper,
    @Inject(PAGINATION_SERVICE)
    private readonly _paginationService: IPaginationService,
    private readonly jwtService: JwtService,
  ) {}

  async getAll(
    query?: UserQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<UserOrmEntity>> {
    const queryBuilder = this.createBaseQuery(manager ?? this._Orm.manager);
    const safeQuery: UserQueryDto = {
      use_cursor: query?.use_cursor ?? false,
      ...query,
      sort_by: query?.sort_by ?? 'users.id',
    };

    const data = await this._paginationService.paginate(
      queryBuilder,
      safeQuery,
      this._dataAccessMapper.toEntity.bind(this._dataAccessMapper),
      this.getFilterOptions(),
    );
    return data as ResponseResult<UserOrmEntity>;
  }

  private createBaseQuery(manager: EntityManager) {
    return manager
      .createQueryBuilder(UserOrmEntity, 'users')
      .leftJoin('users.roles', 'roles')
      .leftJoinAndSelect('users.userHasPermissions', 'userHasPermissions')
      .leftJoin('userHasPermissions.permission', 'permission')
      .leftJoin('users.user_profile', 'profile')
      .addSelect(['roles.id', 'roles.name'])
      .addSelect([
        'permission.id',
        'permission.name',
        'permission.display_name',
      ])
      .addSelect(['profile.id', 'profile.image', 'profile.user_id']);
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
  ): Promise<ResponseResult<UserOrmEntity>> {
    const item = await this.createBaseQuery(manager ?? this._Orm.manager)
      .where('users.id = :id', { id: id })
      .getOneOrFail();
    return this._dataAccessMapper.toEntity(item);
  }

  async getUser(id: number): Promise<UserOrmEntity | null> {
    return this.createBaseQuery(this._Orm.manager)
      .where('users.id = :id', { id: id })
      .getOne();
  }

  async signIn(body: AuthDto, manager?: EntityManager): Promise<any> {
    const { email, password } = body;

    const em = manager ?? this._Orm.manager;
    const repo = em.getRepository(UserOrmEntity);

    // Load roles and permissions needed for the response
    const user = await repo.findOne({
      where: { email },
      relations: [
        'roles',
        'userHasPermissions',
        'userHasPermissions.permission',
      ],
    });

    if (!user) {
      throw new DomainException(
        'errors.auth.invalid_credentials',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const isPasswordValid = await bcrypt.compare(
      password ?? '',
      user.password ?? '',
    );
    if (!isPasswordValid) {
      throw new DomainException(
        'errors.auth.invalid_credentials',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const payload = {
      sub: user.id,
      username: user.name,
      email: user.email,
    };

    const {
      roles = [],
      userHasPermissions = [],
      // strip password
      ...safeUser
    } = user as unknown as UserOrmEntity & {
      roles?: Array<{ name: string }>;
      userHasPermissions?: Array<{ permission?: { name?: string } | null }>;
      password?: string | null;
    };

    const mappedRoles = roles.map((role) => role.name);
    const mappedPermissions = userHasPermissions
      .map((uhp) => uhp.permission?.name)
      .filter((p): p is string => Boolean(p));

    const token = this.jwtService.sign(payload);
    // Persist a bcrypt hash of the access token to the user record
    const tokenHash = await bcrypt.hash(token, 10);
    await repo.save({ id: user.id, access_token: tokenHash });

    return {
      access_token: token,
      user: { ...safeUser, access_token: token },
      roles: mappedRoles,
      permissions: mappedPermissions,
    };
  }

  async logout(user_id: number, manager?: EntityManager): Promise<any> {
    const em = manager ?? this._Orm.manager;
    const repo = em.getRepository(UserOrmEntity);
    return await repo.update(user_id, { access_token: '' });
  }
}
