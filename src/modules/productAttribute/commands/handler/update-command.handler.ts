import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateCommand } from '../update.command';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { ProductAttributeOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/product-attribute.orm';
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
import { DomainException } from '@src/common/exceptions/domain.exception';
import { StoreOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/store.orm';

@CommandHandler(UpdateCommand)
export class UpdateHandler
  implements
    ICommandHandler<UpdateCommand, ResponseResult<ProductAttributeOrmEntity>>
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
    command: UpdateCommand,
  ): Promise<ResponseResult<ProductAttributeOrmEntity>> {
    return await this._transactionManagerService.runInTransaction(
      this._dataSource,
      async (manager) => {
        // check id
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

        await findOneOrFail(
          manager,
          StoreOrmEntity,
          {
            id: command.body.store_id,
          },
          `store id ${command.body.store_id}`,
        );
        return await this._write.update(command.id, command.body, manager);
      },
    );
  }
}
