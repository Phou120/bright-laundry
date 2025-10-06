import { HttpStatus, Injectable } from '@nestjs/common';
import { IWriteUserProfileRepository } from '../../interfaces/user-profile.interface';
import { UserProfileDataAccessMapper } from '../../mappers/user-profile.mapper';
import { OrmEntityMethod } from '@src/common/enums/orm-entity-method.enum';
import { EntityManager } from 'typeorm';
import { CreateDto } from '../../dtos/create.dto';
import { UserProfileOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/user-profile.orm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { DomainException } from '@src/common/exceptions/domain.exception';
import { UpdateProfileDto } from '../../dtos/update-profile.dto';

@Injectable()
export class WriteUserProfileRepository implements IWriteUserProfileRepository {
  constructor(
    private readonly _dataAccessMapper: UserProfileDataAccessMapper,
  ) {}

  async create(
    body: CreateDto,
    user_id: number,
    manager: EntityManager,
  ): Promise<ResponseResult<UserProfileOrmEntity>> {
    const ormData = this._dataAccessMapper.toOrmEntity(
      body,
      OrmEntityMethod.CREATE,
      user_id,
    );
    return this._dataAccessMapper.toEntity(await manager.save(ormData));
  }

  async update(
    id: number,
    body: CreateDto,
    manager: EntityManager,
  ): Promise<ResponseResult<UserProfileOrmEntity>> {
    let profile = await manager.preload(UserProfileOrmEntity, {
      id,
      ...body,
    });

    if (!profile) {
      throw new DomainException('errors.not_found', HttpStatus.NOT_FOUND);
    }

    profile = this._dataAccessMapper.toOrmEntity(
      body,
      OrmEntityMethod.UPDATE,
      profile.user_id,
    );
    profile.id = id;

    const updatedProfile = await manager.save(profile);
    return this._dataAccessMapper.toEntity(updatedProfile);
  }

  async updateProfile(
    id: number,
    body: UpdateProfileDto,
    manager: EntityManager,
  ): Promise<ResponseResult<UserProfileOrmEntity>> {
    const ormData = this._dataAccessMapper.toOrmEntity(
      body,
      OrmEntityMethod.UPDATE,
    );
    ormData.id = id;
    return this._dataAccessMapper.toEntity(await manager.save(ormData));
  }

  async createUserProfile(
    body: UpdateProfileDto,
    user_id: number,
    manager: EntityManager,
  ): Promise<ResponseResult<UserProfileOrmEntity>> {
    const ormData = this._dataAccessMapper.toOrmEntity(
      body,
      OrmEntityMethod.CREATE,
      user_id,
    );
    return this._dataAccessMapper.toEntity(await manager.save(ormData));
  }
}
