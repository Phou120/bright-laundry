import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateCommand } from '../update.command';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { BannerOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/banner.orm';
import {
  TRANSACTION_MANAGER_SERVICE,
  WRITE_BANNER_REPOSITORY,
} from '@src/common/constants/inject-key';
import { HttpStatus, Inject } from '@nestjs/common';
import { IWriteBannerRepository } from '../../interfaces/repository.interface';
import { ITransactionManagerService } from '@src/common/infrastructure/transaction/transaction.interface';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Not } from 'typeorm';
import { DomainException } from '@src/common/exceptions/domain.exception';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';

@CommandHandler(UpdateCommand)
export class UpdateHandler
  implements ICommandHandler<UpdateCommand, ResponseResult<BannerOrmEntity>>
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
    command: UpdateCommand,
  ): Promise<ResponseResult<BannerOrmEntity>> {
    return await this._transactionManagerService.runInTransaction(
      this._dataSource,
      async (manager) => {
        await findOneOrFail(
          manager,
          BannerOrmEntity,
          { id: command.id },
          `${command.id}`,
        );

        const checkExist = await manager.findOne(BannerOrmEntity, {
          where: {
            order_by: String(command.body.order_by),
            id: Not(command.id),
          },
        });
        if (checkExist) {
          const orderBy: number = Number(checkExist.order_by ?? 0) + 1;
          throw new DomainException(
            'errors.order_by_already_exists',
            HttpStatus.BAD_REQUEST,
            {
              property: `${orderBy}`,
            },
          );
        }
        return await this._write.update(command.id, command.body, manager);
      },
    );
  }
}
