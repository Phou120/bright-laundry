import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteCommand } from '../delete.command';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { ProductCategoryOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/product-categoy.orm';
import { HttpStatus, Inject } from '@nestjs/common';
import {
  TRANSACTION_MANAGER_SERVICE,
  WRITE_CATEGORY_REPOSITORY,
} from '@src/common/constants/inject-key';
import { ITransactionManagerService } from '@src/common/infrastructure/transaction/transaction.interface';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { IWriteCategoryRepository } from '../../interfaces/repository.interface';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { DomainException } from '@src/common/exceptions/domain.exception';

@CommandHandler(DeleteCommand)
export class DeleteHandler
  implements ICommandHandler<DeleteCommand, ResponseResult<void>>
{
  constructor(
    @Inject(WRITE_CATEGORY_REPOSITORY)
    private readonly _write: IWriteCategoryRepository,
    @Inject(TRANSACTION_MANAGER_SERVICE)
    private readonly _transactionManagerService: ITransactionManagerService,
    @InjectDataSource(process.env.WRITE_CONNECTION_NAME)
    private readonly _dataSource: DataSource,
  ) {}

  async execute(command: DeleteCommand): Promise<ResponseResult<void>> {
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

        // Check if category exists
        await findOneOrFail(
          manager,
          ProductCategoryOrmEntity,
          { id: command.id },
          `${command.id}`,
        );

        return await this._write.delete(command.id, manager);
      },
    );
  }
}
