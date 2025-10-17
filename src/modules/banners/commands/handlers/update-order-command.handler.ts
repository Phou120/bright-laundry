import {
  TRANSACTION_MANAGER_SERVICE,
  WRITE_BANNER_REPOSITORY,
} from '@src/common/constants/inject-key';
import { IWriteBannerRepository } from '../../interfaces/repository.interface';
import { HttpStatus, Inject } from '@nestjs/common';
import { ITransactionManagerService } from '@src/common/infrastructure/transaction/transaction.interface';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BannerOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/banner.orm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { UpdateOrderCommand } from '../update-order.command';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { DomainException } from '@src/common/exceptions/domain.exception';

@CommandHandler(UpdateOrderCommand)
export class UpdateOrderHandler
  implements
    ICommandHandler<UpdateOrderCommand, ResponseResult<BannerOrmEntity[]>>
{
  constructor(
    @Inject(WRITE_BANNER_REPOSITORY)
    private readonly _write: IWriteBannerRepository,
    @Inject(TRANSACTION_MANAGER_SERVICE)
    private readonly _transactionManagerService: ITransactionManagerService,
    @InjectDataSource(process.env.WRITE_CONNECTION_NAME)
    private readonly _dataSource: DataSource,
  ) {}

  async execute(
    command: UpdateOrderCommand,
  ): Promise<ResponseResult<BannerOrmEntity[]>> {
    return await this._transactionManagerService.runInTransaction(
      this._dataSource,
      async (manager) => {
        // try {
        if (command.body.banner_orders) {
          for (const item of command.body.banner_orders) {
            console.log('object', item);
            await findOneOrFail(
              manager,
              BannerOrmEntity,
              { id: item.id },
              `id: ${item.id}`,
            );
          }
          return await this._write.updateOrder(command.body, manager);
        } else {
          throw new DomainException('errors.not_found', HttpStatus.NOT_FOUND);
        }
        // } catch (e) {
        //   console.log('error', e);
        //   throw new DomainException(
        //     'errors.something_went_wrong',
        //     HttpStatus.INTERNAL_SERVER_ERROR,
        //   );
        // }
      },
    );
  }
}
