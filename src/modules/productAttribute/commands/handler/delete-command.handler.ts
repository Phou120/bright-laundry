import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteCommand } from '../delete.command';
import { HttpStatus, Inject } from '@nestjs/common';
import {
  TRANSACTION_MANAGER_SERVICE,
  WRITE_PRODUCT_ATTRIBUTE_REPOSITORY,
} from '@src/common/constants/inject-key';
import { ITransactionManagerService } from '@src/common/infrastructure/transaction/transaction.interface';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { IWriteProductAttributeRepository } from '../../interfaces/repository.interface';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { ProductAttributeOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/product-attribute.orm';
import { DomainException } from '@src/common/exceptions/domain.exception';

@CommandHandler(DeleteCommand)
export class DeleteHandler implements ICommandHandler<DeleteCommand, void> {
  constructor(
    @Inject(WRITE_PRODUCT_ATTRIBUTE_REPOSITORY)
    private readonly _write: IWriteProductAttributeRepository,
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
            'errors.id_must_be_number',
            HttpStatus.BAD_REQUEST,
            {
              property: `id ${command.id}`,
            },
          );
        }

        await findOneOrFail(
          manager,
          ProductAttributeOrmEntity,
          {
            id: command.id,
          },
          `id ${command.id}`,
        );
        return await this._write.delete(command.id, manager);
      },
    );
  }
}
