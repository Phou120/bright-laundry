import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateProductCommand } from '../update-product.command';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { ProductOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/product.orm';
import { HttpStatus, Inject } from '@nestjs/common';
import {
  TRANSACTION_MANAGER_SERVICE,
  WRITE_PRODUCT_REPOSITORY,
} from '@src/common/constants/inject-key';
import { ITransactionManagerService } from '@src/common/infrastructure/transaction/transaction.interface';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { IWriteProductRepository } from '../../interfaces/repository.interface';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { DomainException } from '@src/common/exceptions/domain.exception';
import { StoreOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/store.orm';
// import { ProductBrandOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/product-brand.orm';
// import { ProductCategoryOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/product-categoy.orm';

@CommandHandler(UpdateProductCommand)
export class UpdateProductHandler
  implements
    ICommandHandler<UpdateProductCommand, ResponseResult<ProductOrmEntity>>
{
  constructor(
    @Inject(WRITE_PRODUCT_REPOSITORY)
    private readonly _write: IWriteProductRepository,
    @Inject(TRANSACTION_MANAGER_SERVICE)
    private readonly _transactionManagerService: ITransactionManagerService,
    @InjectDataSource(process.env.WRITE_CONNECTION_NAME)
    private readonly _dataSource: DataSource,
  ) {}

  async execute(
    command: UpdateProductCommand,
  ): Promise<ResponseResult<ProductOrmEntity>> {
    return await this._transactionManagerService.runInTransaction(
      this._dataSource,
      async (manager) => {
        // Check if id is valid
        if (isNaN(command.id)) {
          throw new DomainException(
            'errors.id_must_be_number',
            HttpStatus.BAD_REQUEST,
            {
              property: `id ${command.id}`,
            },
          );
        }

        // Check if product exists
        await findOneOrFail(
          manager,
          ProductOrmEntity,
          {
            id: command.id,
          },
          `id ${command.id}`,
        );

        // Validate store exists if provided
        if (command.body.store_id) {
          await findOneOrFail(
            manager,
            StoreOrmEntity,
            {
              id: command.body.store_id,
            },
            `store id ${command.body.store_id}`,
          );
        }

        // Validate brand exists if provided
        // if (command.body.brand_id) {
        //   await findOneOrFail(
        //     manager,
        //     ProductBrandOrmEntity,
        //     {
        //       id: command.body.brand_id,
        //     },
        //     `brand id ${command.body.brand_id}`,
        //   );
        // }

        // // Validate category exists if provided
        // if (command.body.category_id) {
        //   await findOneOrFail(
        //     manager,
        //     ProductCategoryOrmEntity,
        //     {
        //       id: command.body.category_id,
        //     },
        //     `category id ${command.body.category_id}`,
        //   );
        // }

        return await this._write.update(command.id, command.body, manager);
      },
    );
  }
}
