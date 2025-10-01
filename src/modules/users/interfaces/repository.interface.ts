import { UserOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/user.orm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { EntityManager } from 'typeorm';
import { CreateDto } from '../dtos/create.dto';
import { UserQueryDto } from '../dtos/query/query.dto';
import { UpdateDto } from '../dtos/update.dto';
import { AuthDto } from '../auth/dtos/auth.dto';
import { ResetPasswordDto } from '../dtos/reset-password.dto';
import { ChangePasswordDto } from '../dtos/change-password.dto';

export interface IWriteUserRepository {
  create(
    body: CreateDto,
    password: string,
    manager: EntityManager,
    code: string,
  ): Promise<ResponseResult<UserOrmEntity>>;

  createStoreUser(
    body: CreateDto,
    password: string,
    manager: EntityManager,
    code: string,
    role_name: string,
  ): Promise<ResponseResult<UserOrmEntity>>;

  updateStoreUser(
    id: number,
    body: UpdateDto,
    manager: EntityManager,
    password?: string,
  ): Promise<ResponseResult<UserOrmEntity>>;

  update(
    id: number,
    body: UpdateDto,
    manager: EntityManager,
  ): Promise<ResponseResult<UserOrmEntity>>;

  delete(id: number, manager: EntityManager): Promise<void>;

  saveOTP(otp: string, id: number, manager: EntityManager): Promise<void>;

  resetPassword(
    id: number,
    body: ResetPasswordDto,
    manager: EntityManager,
  ): Promise<ResponseResult<UserOrmEntity>>;

  changePassword(
    id: number,
    body: ChangePasswordDto,
    manager: EntityManager,
  ): Promise<ResponseResult<UserOrmEntity>>;
}

export interface IReadUserRepository {
  getAll(
    query: UserQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<UserOrmEntity>>;

  getOne(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<UserOrmEntity>>;

  signIn(body: AuthDto, manager?: EntityManager): Promise<string>;

  getUser(id: number): Promise<UserOrmEntity | null>;

  logout(user_id: number, manager?: EntityManager): Promise<any>;
}
