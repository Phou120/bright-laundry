import { Injectable, NotFoundException } from '@nestjs/common';
import { IWriteUserRepository } from '../interfaces/repository.interface';
import { UserOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/user.orm';
import { UserDataAccessMapper } from '../mappers/user.mapper';
import { OrmEntityMethod } from '@src/common/enums/orm-entity-method.enum';
import { EntityManager, In } from 'typeorm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { CreateDto } from '../dtos/create.dto';
import { RoleOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/role.orm';
import { PermissionOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/permission.orm';
import { UserHasPermissionOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/user-has-permission.orm';
import { ResetPasswordDto } from '../dtos/reset-password.dto';

@Injectable()
export class WriteUserRepository implements IWriteUserRepository {
  constructor(private readonly _dataAccessMapper: UserDataAccessMapper) {}

  async create(
    body: CreateDto,
    password: string,
    manager: EntityManager,
    code: string,
  ): Promise<ResponseResult<UserOrmEntity>> {
    const ormUser = this._dataAccessMapper.toOrmEntity(
      body,
      OrmEntityMethod.CREATE,
      password,
      code,
    );

    const roles = await manager.findBy(RoleOrmEntity, {
      id: In(body.roles),
    });

    ormUser.roles = roles;

    const savedUser = await manager.save(ormUser);

    const permissions = await manager.findBy(PermissionOrmEntity, {
      id: In(body.permissions),
    });

    const userHasPermissions = permissions.map((permission) => {
      const userHasPermission = new UserHasPermissionOrmEntity();
      userHasPermission.user = savedUser;
      userHasPermission.permission = permission;
      return userHasPermission;
    });

    await manager.save(UserHasPermissionOrmEntity, userHasPermissions);

    return this._dataAccessMapper.toEntity(savedUser);
  }

  async update(
    id: number,
    body: CreateDto,
    manager: EntityManager,
  ): Promise<ResponseResult<UserOrmEntity>> {
    const { roles, permissions, ...scalarBody } = body;
    let user = await manager.preload(UserOrmEntity, {
      id,
      ...scalarBody,
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    if (body.roles && body.roles.length) {
      const roles = await manager.findBy(RoleOrmEntity, { id: In(body.roles) });
      user.roles = roles;
    } else {
      user.roles = [];
    }

    user = await manager.save(user);

    if (Array.isArray(body.permissions)) {
      await manager.delete(UserHasPermissionOrmEntity, {
        user: { id: user.id },
      });

      if (body.permissions.length) {
        const permissions = await manager.findBy(PermissionOrmEntity, {
          id: In(body.permissions),
        });

        const userHasPermissions = permissions.map((permission) => {
          const link = new UserHasPermissionOrmEntity();
          link.user = user;
          link.permission = permission;
          return link;
        });

        await manager.save(UserHasPermissionOrmEntity, userHasPermissions);
      }
    }
    return this._dataAccessMapper.toEntity(user);
  }

  async delete(id: number, manager: EntityManager): Promise<void> {
    await manager.softDelete(UserOrmEntity, id);
  }
  async saveOTP(
    otp: string,
    id: number,
    manager: EntityManager,
  ): Promise<void> {
    await manager.update(UserOrmEntity, id, { verify_otp: otp });
  }

  async resetPassword(
    id: number,
    body: ResetPasswordDto,
    manager: EntityManager,
  ): Promise<ResponseResult<UserOrmEntity>> {
    const user = await manager.preload(UserOrmEntity, {
      id,
      password: body.password,
    });

    return this._dataAccessMapper.toEntity(await manager.save(user!));
  }
}
