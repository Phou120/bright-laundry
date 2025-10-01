import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateStoreUserCommand } from '../update.command';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { StoreUserOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/store-user.orm';
import { HttpStatus, Inject } from '@nestjs/common';
import {
  TRANSACTION_MANAGER_SERVICE,
  WRITE_STORE_USER_REPOSITORY,
  WRITE_USER_PERMISSION_REPOSITORY,
  WRITE_USER_PROFILE_REPOSITORY,
  WRITE_USER_REPOSITORY,
} from '@src/common/constants/inject-key';
import { IWriteStoreUserRepository } from '../../interfaces/repository.interface';
import { IWriteUserRepository } from '@src/modules/users/interfaces/repository.interface';
import { IWriteUserPermissionRepository } from '@src/modules/users/interfaces/user-permission-repository.interface';
import { IWriteUserProfileRepository } from '@src/modules/users/interfaces/user-profile.interface';
import { ITransactionManagerService } from '@src/common/infrastructure/transaction/transaction.interface';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { _checkColumnDuplicate } from '@src/common/utils/check-column-duplicate-orm.util';
import { UserOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/user.orm';
import { RoleOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/role.orm';
import { UpdateDto } from '@src/modules/users/dtos/update.dto';
import { DomainException } from '@src/common/exceptions/domain.exception';
import { PermissionOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/permission.orm';
import { UserProfileOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/user-profile.orm';

@CommandHandler(UpdateStoreUserCommand)
export class UpdateHandler
  implements
    ICommandHandler<UpdateStoreUserCommand, ResponseResult<StoreUserOrmEntity>>
{
  constructor(
    @Inject(WRITE_STORE_USER_REPOSITORY)
    private readonly _write: IWriteStoreUserRepository,
    @Inject(WRITE_USER_REPOSITORY)
    private readonly _writeUser: IWriteUserRepository,
    @Inject(WRITE_USER_PERMISSION_REPOSITORY)
    private readonly _writeUserPermission: IWriteUserPermissionRepository,
    @Inject(WRITE_USER_PROFILE_REPOSITORY)
    private readonly _writeUserProfileRepository: IWriteUserProfileRepository,
    @Inject(TRANSACTION_MANAGER_SERVICE)
    private readonly _transactionManagerService: ITransactionManagerService,
    @InjectDataSource(process.env.WRITE_CONNECTION_NAME)
    private readonly _dataSource: DataSource,
  ) {}

  async execute(
    command: UpdateStoreUserCommand,
  ): Promise<ResponseResult<StoreUserOrmEntity>> {
    return await this._transactionManagerService.runInTransaction(
      this._dataSource,
      async (manager) => {
        const store_user = await findOneOrFail(
          manager,
          StoreUserOrmEntity,
          {
            id: command.id,
          },
          `id ${command.id}`,
        );

        if (!store_user) {
          throw new DomainException('errors.not_found', HttpStatus.NOT_FOUND, {
            property: `id ${command.id}`,
          });
        }

        const id = store_user.user_id;
        if (!id) {
          throw new DomainException('errors.not_found', HttpStatus.NOT_FOUND, {
            property: `id ${command.id}`,
          });
        }

        await _checkColumnDuplicate(
          UserOrmEntity,
          'tel',
          command.dto.tel,
          manager,
          'errors.tel_already_exists',
          id,
        );
        await _checkColumnDuplicate(
          UserOrmEntity,
          'email',
          command.dto.email,
          manager,
          'errors.email_already_exists',
          id,
        );

        const userData = command.dto as unknown as UpdateDto;

        const role_name = 'store-user';
        await findOneOrFail(
          manager,
          RoleOrmEntity,
          {
            name: role_name,
          },
          `role ${role_name}`,
        );

        const user = await this._writeUser.updateStoreUser(
          id,
          userData,
          manager,
        );

        const user_id = (user as UserOrmEntity).id;
        await this._writeUserPermission.delete(user_id, manager);

        for (const permission of command.dto.permissions) {
          await findOneOrFail(
            manager,
            PermissionOrmEntity,
            {
              id: permission,
            },
            `Permission ${permission}`,
          );

          await this._writeUserPermission.create(user_id, permission, manager);
        }

        const profile = await findOneOrFail(
          manager,
          UserProfileOrmEntity,
          { user_id: user_id },
          `User ${user_id}`,
        );

        const profile_id = profile.id;

        await this._writeUserProfileRepository.update(
          profile_id,
          userData,
          manager,
        );

        return store_user;
      },
    );
  }
}
