import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteCommand } from '../delete.command';
import {
  TRANSACTION_MANAGER_SERVICE,
  WRITE_SUPPLIER_REPOSITORY,
} from '@src/common/constants/inject-key';
import { HttpStatus, Inject } from '@nestjs/common';
import { IWriteSupplierRepository } from '../../interfaces/repository.interface';
import { ITransactionManagerService } from '@src/common/infrastructure/transaction/transaction.interface';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { DomainException } from '@src/common/exceptions/domain.exception';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { SupplierOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/supplier.orm';

@CommandHandler(DeleteCommand)
export class DeleteHandler implements ICommandHandler<DeleteCommand, void> {
  constructor(
    @Inject(WRITE_SUPPLIER_REPOSITORY)
    private readonly _write: IWriteSupplierRepository,
    @Inject(TRANSACTION_MANAGER_SERVICE)
    private readonly _transactionManagerService: ITransactionManagerService,
    @InjectDataSource(process.env.WRITE_CONNECTION_NAME)
    private readonly _dataSource: DataSource,
  ) {}

  async execute(command: DeleteCommand): Promise<void> {
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

        await findOneOrFail(
          manager,
          SupplierOrmEntity,
          {
            id: command.id,
          },
          `${command.id}`,
        );

        return await this._write.delete(command.id, manager);
      },
    );
  }
}
