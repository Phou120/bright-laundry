import { EntityManager } from 'typeorm';
import { CreateDto } from '../dtos/create.dto';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { UserProfileOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/user-profile.orm';
import { UpdateDto } from '../dtos/update.dto';
import { UpdateProfileDto } from '../dtos/update-profile.dto';

export interface IWriteUserProfileRepository {
  create(
    body: CreateDto,
    user_id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<UserProfileOrmEntity>>;

  update(
    id: number,
    body: UpdateDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<UserProfileOrmEntity>>;

  updateProfile(
    id: number,
    body: UpdateProfileDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<UserProfileOrmEntity>>;

  createUserProfile(
    body: UpdateProfileDto,
    user_id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<UserProfileOrmEntity>>;
}
