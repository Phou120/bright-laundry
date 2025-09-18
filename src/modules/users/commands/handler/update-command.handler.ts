import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateCommand } from '../update.command';
import { UserOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/user.orm';
import {
  TRANSACTION_MANAGER_SERVICE,
  WRITE_USER_PROFILE_REPOSITORY,
  WRITE_USER_REPOSITORY,
} from '@src/common/constants/inject-key';
import { HttpStatus, Inject } from '@nestjs/common';
import { IWriteUserRepository } from '../../interfaces/repository.interface';
import { ITransactionManagerService } from '@src/common/infrastructure/transaction/transaction.interface';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { _checkColumnDuplicate } from '@src/common/utils/check-column-duplicate-orm.util';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { RoleOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/role.orm';
import { PermissionOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/permission.orm';
import { DomainException } from '@src/common/exceptions/domain.exception';
import { IWriteUserProfileRepository } from '../../interfaces/user-profile.interface';
import { UserProfileOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/user-profile.orm';

@CommandHandler(UpdateCommand)
export class UpdateHandler
  implements ICommandHandler<UpdateCommand, ResponseResult<UserOrmEntity>>
{
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
    command: UpdateCommand,
  ): Promise<ResponseResult<UserOrmEntity>> {
    return await this._transactionManagerService.runInTransaction(
      this._dataSource,
      async (manager) => {
        if (isNaN(command.id)) {
          throw new DomainException(
            'errors.id_must_be_number',
            HttpStatus.BAD_REQUEST,
            {
              property: `id ${command.id}`,
            },
          );
        }
        await findOneOrFail(
          manager,
          UserOrmEntity,
          { id: command.id },
          `${command.id}`,
        );
        await _checkColumnDuplicate(
          UserOrmEntity,
          'email',
          command.body.email,
          manager,
          'errors.email_already_exists',
          command.id,
        );

        await _checkColumnDuplicate(
          UserOrmEntity,
          'tel',
          command.body.tel,
          manager,
          'errors.tel_already_exists',
          command.id,
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
        const user = await this._write.update(
          command.id,
          command.body,
          manager,
        );
        const user_id = (user as UserOrmEntity).id;
        const profile = await findOneOrFail(
          manager,
          UserProfileOrmEntity,
          { user_id: user_id },
          `User ${user_id}`,
        );

        const profile_id = profile.id;

        await this._writeUserProfileRepository.update(
          profile_id,
          command.body,
          manager,
        );
        return user;
      },
    );
  }
}
