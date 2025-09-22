import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectDataSource } from '@nestjs/typeorm';
import {
  TRANSACTION_MANAGER_SERVICE,
  WRITE_SUPPLIER_REPOSITORY,
} from '@src/common/constants/inject-key';
import { SupplierOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/supplier.orm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { ITransactionManagerService } from '@src/common/infrastructure/transaction/transaction.interface';
import { DataSource } from 'typeorm';
import { CreateCommand } from '../create.command';
import { IWriteSupplierRepository } from '../../interfaces/repository.interface';
import { _checkColumnDuplicate } from '@src/common/utils/check-column-duplicate-orm.util';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { UserOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/user.orm';

@CommandHandler(CreateCommand)
export class CreateHandler
  implements ICommandHandler<CreateCommand, ResponseResult<SupplierOrmEntity>>
{
  constructor(
    @Inject(WRITE_SUPPLIER_REPOSITORY)
    private readonly _write: IWriteSupplierRepository,
    @Inject(TRANSACTION_MANAGER_SERVICE)
    private readonly _transactionManagerService: ITransactionManagerService,
    @InjectDataSource(process.env.WRITE_CONNECTION_NAME)
    private readonly _dataSource: DataSource,
  ) {}

  async execute(
    command: CreateCommand,
  ): Promise<ResponseResult<SupplierOrmEntity>> {
    return await this._transactionManagerService.runInTransaction(
      this._dataSource,
      async (manager) => {
        await findOneOrFail(manager, UserOrmEntity, {
          id: command.created_by,
        });

        await _checkColumnDuplicate(
          SupplierOrmEntity,
          'name',
          command.body.name,
          manager,
          'errors.name_already_exists',
        );

        await _checkColumnDuplicate(
          SupplierOrmEntity,
          'email',
          command.body.email,
          manager,
          'errors.email_already_exists',
        );

        await _checkColumnDuplicate(
          SupplierOrmEntity,
          'phone_number',
          command.body.phone_number,
          manager,
          'errors.tel_already_exists',
        );

        if (command.body.company) {
          await _checkColumnDuplicate(
            SupplierOrmEntity,
            'company',
            command.body.company,
            manager,
            'errors.company_already_exists',
          );
        }
        return await this._write.create(
          command.body,
          command.created_by,
          manager,
        );
      },
    );
  }
}
