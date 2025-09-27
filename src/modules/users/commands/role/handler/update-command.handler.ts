import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateRoleCommand } from '../update.command';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { RoleOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/role.orm';
import {
  TRANSACTION_MANAGER_SERVICE,
  WRITE_ROLE_PERMISSION_REPOSITORY,
  WRITE_ROLE_REPOSITORY,
} from '@src/common/constants/inject-key';
import { HttpStatus, Inject } from '@nestjs/common';
import { IWriteRoleRepository } from '@src/modules/users/interfaces/role.interface';
import { _checkColumnDuplicate } from '@src/common/utils/check-column-duplicate-orm.util';
import { IWriteRolePermissionRepository } from '@src/modules/users/interfaces/role-permission-repository.interface';
import { ITransactionManagerService } from '@src/common/infrastructure/transaction/transaction.interface';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { PermissionOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/permission.orm';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { DomainException } from '@src/common/exceptions/domain.exception';

@CommandHandler(UpdateRoleCommand)
export class UpdateRoleHandler
  implements ICommandHandler<UpdateRoleCommand, ResponseResult<RoleOrmEntity>>
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
    command: UpdateRoleCommand,
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
          command.id,
        );

        await _checkColumnDuplicate(
          RoleOrmEntity,
          'display_name',
          command.body.display_name,
          manager,
          'errors.display_name_already_exists',
          command.id,
        );

        const role = await this._write.update(
          command.id,
          command.body,
          manager,
        );

        if (!role) {
          throw new DomainException(
            'errors.create_role_failed',
            HttpStatus.BAD_REQUEST,
            {
              property: `${role}`,
            },
          );
        }

        if (
          !command.body.permission_ids ||
          command.body.permission_ids.length === 0
        ) {
          throw new DomainException(
            'errors.permission_ids_required',
            HttpStatus.BAD_REQUEST,
            {
              property: `permission_ids`,
            },
          );
        }

        if (role) {
          await this._writeRolePermission.deleteRolePermissions(
            (role as RoleOrmEntity).id,
            manager,
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
          await this._writeRolePermission.updateRolePermissions(
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
