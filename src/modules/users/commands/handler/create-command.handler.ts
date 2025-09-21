import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateCommand } from '../create.command';
import {
  E_COMMERCE,
  MAX_GENERATE_CODE_LENGTH,
  MIN_GENERATE_CODE_LENGTH,
  TRANSACTION_MANAGER_SERVICE,
  WRITE_USER_PROFILE_REPOSITORY,
  WRITE_USER_REPOSITORY,
} from '@src/common/constants/inject-key';
import { Inject } from '@nestjs/common';
import { IWriteUserRepository } from '../../interfaces/repository.interface';
import { UserOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/user.orm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { hashPassword } from '@src/common/utils/hash-password';
import { ITransactionManagerService } from '@src/common/infrastructure/transaction/transaction.interface';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { RoleOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/role.orm';
import { PermissionOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/permission.orm';
import { _checkColumnDuplicate } from '@src/common/utils/check-column-duplicate-orm.util';
import { IWriteUserProfileRepository } from '../../interfaces/user-profile.interface';
import { generateUniqueCode } from '@src/common/utils/generate-code.util';

@CommandHandler(CreateCommand)
export class CreateHandler implements ICommandHandler<CreateCommand, any> {
  constructor(
    @Inject(WRITE_USER_REPOSITORY)
    private readonly _write: IWriteUserRepository,
    @Inject(WRITE_USER_PROFILE_REPOSITORY)
    private readonly _writeUserProfileRepository: IWriteUserProfileRepository,
    @Inject(TRANSACTION_MANAGER_SERVICE)
    private readonly _transactionManagerService: ITransactionManagerService,
    @InjectDataSource(process.env.WRITE_CONNECTION_NAME)
    private readonly _dataSource: DataSource,
  ) {}

  async execute(
    command: CreateCommand,
  ): Promise<ResponseResult<UserOrmEntity>> {
    return await this._transactionManagerService.runInTransaction(
      this._dataSource,
      async (manager) => {
        const code = await this.generateUniqueCustomerCode(manager);
        await _checkColumnDuplicate(
          UserOrmEntity,
          'email',
          command.body.email,
          manager,
          'errors.email_already_exists',
        );

        await _checkColumnDuplicate(
          UserOrmEntity,
          'tel',
          command.body.tel,
          manager,
          'errors.tel_already_exists',
        );

        for (const role of command.body.roles) {
          await findOneOrFail(
            manager,
            RoleOrmEntity,
            {
              id: role,
            },
            `Role ${role}`,
          );
        }

        for (const permission of command.body.permissions) {
          await findOneOrFail(
            manager,
            PermissionOrmEntity,
            {
              id: permission,
            },
            `Permission ${permission}`,
          );
        }

        const password = await hashPassword(command.body.password);
        const user = await this._write.create(
          command.body,
          password,
          manager,
          code,
        );
        const user_id = (user as UserOrmEntity).id;

        await this._writeUserProfileRepository.create(
          command.body,
          user_id,
          manager,
        );
        return user;
      },
    );
  }

  async generateUniqueCustomerCode(manager: EntityManager): Promise<string> {
    return generateUniqueCode(
      E_COMMERCE,
      async (code) => {
        const existing = await manager.findOne(UserOrmEntity, {
          where: { user_no: code },
        });
        return !!existing;
      },
      MIN_GENERATE_CODE_LENGTH,
      MAX_GENERATE_CODE_LENGTH,
    );
  }
}
