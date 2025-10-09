import {
  E_COMMERCE,
  MAX_GENERATE_CODE_LENGTH,
  TRANSACTION_MANAGER_SERVICE,
  WRITE_STORE_USER_REPOSITORY,
  WRITE_USER_PERMISSION_REPOSITORY,
  WRITE_USER_PROFILE_REPOSITORY,
  WRITE_USER_REPOSITORY,
} from '@src/common/constants/inject-key';
import { UserOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/user.orm';
import { generateUniqueNo } from '@src/common/utils/generate-code.util';
import { DataSource, EntityManager } from 'typeorm';
import { CreateAdminStoreUserCommand } from '../admin-crerate.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { StoreUserOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/store-user.orm';
import { Inject } from '@nestjs/common';
import { IWriteStoreUserRepository } from '../../interfaces/repository.interface';
import { IWriteUserRepository } from '@src/modules/users/interfaces/repository.interface';
import { IWriteUserPermissionRepository } from '@src/modules/users/interfaces/user-permission-repository.interface';
import { IWriteUserProfileRepository } from '@src/modules/users/interfaces/user-profile.interface';
import { ITransactionManagerService } from '@src/common/infrastructure/transaction/transaction.interface';
import { InjectDataSource } from '@nestjs/typeorm';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { _checkColumnDuplicate } from '@src/common/utils/check-column-duplicate-orm.util';
import { CreateDto } from '@src/modules/users/dtos/create.dto';
import { RoleOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/role.orm';
import { hashPassword } from '@src/common/utils/hash-password';
import { PermissionOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/permission.orm';
import { StoreOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/store.orm';

@CommandHandler(CreateAdminStoreUserCommand)
export class CreateAdminHandler
  implements
    ICommandHandler<
      CreateAdminStoreUserCommand,
      ResponseResult<StoreUserOrmEntity>
    >
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
    command: CreateAdminStoreUserCommand,
  ): Promise<ResponseResult<StoreUserOrmEntity>> {
    return await this._transactionManagerService.runInTransaction(
      this._dataSource,
      async (manager) => {
        const code = await this.generateUniqueCustomerCode(manager);
        const store = await findOneOrFail(
          manager,
          StoreOrmEntity,
          {
            id: command.dto.store_id,
          },
          `store ${command.dto.store_id}`,
        );

        await _checkColumnDuplicate(
          UserOrmEntity,
          'tel',
          command.dto.tel,
          manager,
          'errors.tel_already_exists',
        );
        await _checkColumnDuplicate(
          UserOrmEntity,
          'email',
          command.dto.email,
          manager,
          'errors.email_already_exists',
        );

        const store_id = store.id;
        const userData = command.dto as unknown as CreateDto;

        const role_name = 'store-user';
        await findOneOrFail(
          manager,
          RoleOrmEntity,
          {
            name: role_name,
          },
          `${role_name}`,
        );

        const hashedPassword = await hashPassword(command.dto.password);
        const user = await this._writeUser.createStoreUser(
          userData,
          hashedPassword,
          manager,
          code,
          role_name,
        );

        const user_id = (user as UserOrmEntity).id;

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

        await this._writeUserProfileRepository.create(
          userData,
          user_id,
          manager,
        );
        return await this._write.create(user_id, store_id, manager);
      },
    );
  }

  async generateUniqueCustomerCode(manager: EntityManager): Promise<string> {
    return generateUniqueNo(
      MAX_GENERATE_CODE_LENGTH,
      async (code: string) => {
        const existing = await manager.findOne(UserOrmEntity, {
          where: { user_no: code },
        });
        return !!existing;
      },
      E_COMMERCE,
    );
  }
}
