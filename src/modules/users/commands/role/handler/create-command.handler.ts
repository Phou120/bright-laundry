import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateRoleCommand } from '../create.command';
import {
  TRANSACTION_MANAGER_SERVICE,
  WRITE_ROLE_PERMISSION_REPOSITORY,
  WRITE_ROLE_REPOSITORY,
} from '@src/common/constants/inject-key';
import { HttpStatus, Inject } from '@nestjs/common';
import { RoleOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/role.orm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { _checkColumnDuplicate } from '@src/common/utils/check-column-duplicate-orm.util';
import { IWriteRoleRepository } from '@src/modules/users/interfaces/role.interface';
import { InjectDataSource } from '@nestjs/typeorm';
import { ITransactionManagerService } from '@src/common/infrastructure/transaction/transaction.interface';
import { DataSource } from 'typeorm';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { PermissionOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/permission.orm';
import { DomainException } from '@src/common/exceptions/domain.exception';
import { IWriteRolePermissionRepository } from '@src/modules/users/interfaces/role-permission-repository.interface';

@CommandHandler(CreateRoleCommand)
export class CreateRoleHandler
  implements ICommandHandler<CreateRoleCommand, ResponseResult<RoleOrmEntity>>
{
  constructor(
    @Inject(WRITE_ROLE_REPOSITORY)
    private readonly _write: IWriteRoleRepository,
    @Inject(WRITE_ROLE_PERMISSION_REPOSITORY)
    private readonly _writeRolePermission: IWriteRolePermissionRepository,
    @Inject(TRANSACTION_MANAGER_SERVICE)
    private readonly _transactionManagerService: ITransactionManagerService,
    @InjectDataSource(process.env.WRITE_CONNECTION_NAME)
    private readonly _dataSource: DataSource,
  ) {}

  async execute(
    command: CreateRoleCommand,
  ): Promise<ResponseResult<RoleOrmEntity>> {
    return await this._transactionManagerService.runInTransaction(
      this._dataSource,
      async (manager) => {
        await _checkColumnDuplicate(
          RoleOrmEntity,
          'name',
          command.body.name,
          manager,
          'errors.name_already_exists',
        );

        await _checkColumnDuplicate(
          RoleOrmEntity,
          'display_name',
          command.body.display_name,
          manager,
          'errors.display_name_already_exists',
        );

        const role = await this._write.create(command.body, manager);
        if (!role) {
          throw new DomainException(
            'errors.create_role_failed',
            HttpStatus.BAD_REQUEST,
            {
              property: `${role}`,
            },
          );
        }

        for (const permission of command.body.permission_ids) {
          await findOneOrFail(
            manager,
            PermissionOrmEntity,
            {
              id: permission,
            },
            `Permission ${permission}`,
          );
          await this._writeRolePermission.addRolePermissions(
            (role as RoleOrmEntity).id,
            permission,
            manager,
          );
        }
        return role;
      },
    );
  }
}
