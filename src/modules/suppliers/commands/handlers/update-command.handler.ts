import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateCommand } from '../update.command';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { SupplierOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/supplier.orm';
import { HttpStatus, Inject } from '@nestjs/common';
import {
  TRANSACTION_MANAGER_SERVICE,
  WRITE_SUPPLIER_REPOSITORY,
} from '@src/common/constants/inject-key';
import { IWriteSupplierRepository } from '../../interfaces/repository.interface';
import { ITransactionManagerService } from '@src/common/infrastructure/transaction/transaction.interface';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { UserOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/user.orm';
import { _checkColumnDuplicate } from '@src/common/utils/check-column-duplicate-orm.util';
import { DomainException } from '@src/common/exceptions/domain.exception';

@CommandHandler(UpdateCommand)
export class UpdateHandler
  implements ICommandHandler<UpdateCommand, ResponseResult<SupplierOrmEntity>>
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
    command: UpdateCommand,
  ): Promise<ResponseResult<SupplierOrmEntity>> {
    return await this._transactionManagerService.runInTransaction(
      this._dataSource,
      async (manager) => {
        if (isNaN(command.id)) {
          throw new DomainException(
            'errors.id_must_be_a_number',
            HttpStatus.BAD_REQUEST,
            { property: `id ${command.id}` },
          );
        }

        await findOneOrFail(manager, UserOrmEntity, {
          id: command.user_id,
        });

        await findOneOrFail(
          manager,
          SupplierOrmEntity,
          {
            id: command.id,
          },
          `${command.id}`,
        );

        await _checkColumnDuplicate(
          SupplierOrmEntity,
          'name',
          command.body.name,
          manager,
          'errors.name_already_exists',
          command.id,
        );

        await _checkColumnDuplicate(
          SupplierOrmEntity,
          'email',
          command.body.email,
          manager,
          'errors.email_already_exists',
          command.id,
        );

        await _checkColumnDuplicate(
          SupplierOrmEntity,
          'phone_number',
          command.body.phone_number,
          manager,
          'errors.tel_already_exists',
          command.id,
        );

        if (command.body.company) {
          await _checkColumnDuplicate(
            SupplierOrmEntity,
            'company',
            command.body.company,
            manager,
            'errors.company_already_exists',
            command.id,
          );
        }
        return await this._write.update(
          command.id,
          command.body,
          command.user_id,
          manager,
        );
      },
    );
  }
}
