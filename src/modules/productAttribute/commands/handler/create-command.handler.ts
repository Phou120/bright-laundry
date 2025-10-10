import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateCommand } from '../create.command';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { ProductAttributeOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/product-attribute.orm';
import { Inject } from '@nestjs/common';
import {
  TRANSACTION_MANAGER_SERVICE,
  WRITE_PRODUCT_ATTRIBUTE_REPOSITORY,
} from '@src/common/constants/inject-key';
import { ITransactionManagerService } from '@src/common/infrastructure/transaction/transaction.interface';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { IWriteProductAttributeRepository } from '../../interfaces/repository.interface';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { StoreOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/store.orm';

@CommandHandler(CreateCommand)
export class CreateHandler
  implements
    ICommandHandler<CreateCommand, ResponseResult<ProductAttributeOrmEntity>>
{
  constructor(
    @Inject(WRITE_PRODUCT_ATTRIBUTE_REPOSITORY)
    private readonly _write: IWriteProductAttributeRepository,
    @Inject(TRANSACTION_MANAGER_SERVICE)
    private readonly _transactionManagerService: ITransactionManagerService,
    @InjectDataSource(process.env.WRITE_CONNECTION_NAME)
    private readonly _dataSource: DataSource,
  ) {}

  async execute(
    command: CreateCommand,
  ): Promise<ResponseResult<ProductAttributeOrmEntity>> {
    return await this._transactionManagerService.runInTransaction(
      this._dataSource,
      async (manager) => {
        await findOneOrFail(
          manager,
          StoreOrmEntity,
          {
            id: command.body.store_id,
          },
          `store id ${command.body.store_id}`,
        );
        return await this._write.create(command.body, manager);
      },
    );
  }
}
