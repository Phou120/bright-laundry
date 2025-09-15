import { UserOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/user.orm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { EntityManager } from 'typeorm';
import { CreateDto } from '../dtos/create.dto';
import { UserQueryDto } from '../dtos/query/query.dto';
import { UpdateDto } from '../dtos/update.dto';
import { RoleOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/role.orm';
import { CreateRoleDto } from '../dtos/create-role.dto';
import { UpdateRoleDto } from '../dtos/update-role.dto';
import { SendMailDto } from '../dtos/send-mail.dto';
import { VerifyOtpDto } from '../dtos/verify-otp.dto';
import { ResetPasswordDto } from '../dtos/reset-password.dto';

export interface IUserServiceInterface {
  create(
    body: CreateDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<UserOrmEntity>>;

  getAll(
    query?: UserQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<UserOrmEntity>>;

  getOne(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<UserOrmEntity>>;

  update(
    id: number,
    body: UpdateDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<UserOrmEntity>>;

  delete(id: number, manager?: EntityManager): Promise<void>;

  // create role
  createRole(
    body: CreateRoleDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<RoleOrmEntity>>;

  // get all role
  getAllRole(
    query?: UserQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<RoleOrmEntity>>;

  // get one role
  getOneRole(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<RoleOrmEntity>>;

  // update role
  updateRole(
    id: number,
    body: UpdateRoleDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<RoleOrmEntity>>;

  // delete role
  deleteRole(id: number, manager?: EntityManager): Promise<void>;

  // upload file
  uploadFile(
    file: Express.Multer.File,
    manager?: EntityManager,
  ): Promise<{ imageUrl: string }>;

  uploadFiles(
    files: Express.Multer.File[],
    manager?: EntityManager,
  ): Promise<{ imageUrls: string[] }>;

  // send mail
  sendMail(body: SendMailDto, manager?: EntityManager): Promise<void>;
  // verify otp
  verifyOtp(
    body: VerifyOtpDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<UserOrmEntity>>;

  // reset password
  resetPassword(
    id: number,
    body: ResetPasswordDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<UserOrmEntity>>;
}
