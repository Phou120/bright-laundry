import { Injectable } from '@nestjs/common';
import { UserHasPermissionOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/user-has-permission.orm';

@Injectable()
export class UserPermissionDataAccessMapper {
  toOrmEntity(
    user_id: number,
    permission_id: number,
  ): UserHasPermissionOrmEntity {
    const ormEntity = new UserHasPermissionOrmEntity();
    ormEntity.user_id = user_id;
    ormEntity.permission_id = permission_id;

    return ormEntity;
  }

  toEntity(ormData: UserHasPermissionOrmEntity): UserHasPermissionOrmEntity {
    return {
      user_id: ormData.user_id,
      permission_id: ormData.permission_id,
    } as unknown as UserHasPermissionOrmEntity;
  }
}
