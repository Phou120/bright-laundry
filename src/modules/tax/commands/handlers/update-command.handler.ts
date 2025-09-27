import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateCommand } from '../update.command';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { TaxOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/tax.orm';
import { Inject } from '@nestjs/common';
import {
  TRANSACTION_MANAGER_SERVICE,
  WRITE_TAX_REPOSITORY,
} from '@src/common/constants/inject-key';
import { ITransactionManagerService } from '@src/common/infrastructure/transaction/transaction.interface';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { _checkColumnDuplicate } from '@src/common/utils/check-column-duplicate-orm.util';
import { IWriteTaxRepository } from '../../interfaces/repository.interface';

@CommandHandler(UpdateCommand)
export class UpdateHandler
  implements ICommandHandler<UpdateCommand, ResponseResult<TaxOrmEntity>>
{
  constructor(
    @Inject(WRITE_TAX_REPOSITORY)
    private readonly _write: IWriteTaxRepository,
    @Inject(TRANSACTION_MANAGER_SERVICE)
    private readonly _transactionManagerService: ITransactionManagerService,
    @InjectDataSource(process.env.WRITE_CONNECTION_NAME)
    private readonly _dataSource: DataSource,
  ) {}

  async execute(command: UpdateCommand): Promise<ResponseResult<TaxOrmEntity>> {
    return await this._transactionManagerService.runInTransaction(
      this._dataSource,
      async (manager) => {
        await _checkColumnDuplicate(
          TaxOrmEntity,
          'name',
          command.body.name,
          manager,
          'errors.name_already_exists',
        );

        return await this._write.update(command.id, command.body, manager);
      },
    );
  }
}
