import { HttpStatus, Inject } from '@nestjs/common';
import { DomainException } from '@src/common/exceptions/domain.exception';
import { UpdateStatusCommand } from '../update-status.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { StoreOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/store.orm';
import { IWriteStoreRepository } from '../../interfaces/repository.interface';
import {
  TRANSACTION_MANAGER_SERVICE,
  WRITE_STORE_REPOSITORY,
} from '@src/common/constants/inject-key';
import { ITransactionManagerService } from '@src/common/infrastructure/transaction/transaction.interface';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import {
  EnumStoreStatus,
  EnumStoreStatusString,
} from '@src/common/enums/orm-entity-method.enum';

@CommandHandler(UpdateStatusCommand)
export class UpdateStatusCommandHandler
  implements
    ICommandHandler<UpdateStatusCommand, ResponseResult<StoreOrmEntity>>
{
  constructor(
    @Inject(WRITE_STORE_REPOSITORY)
    private readonly _write: IWriteStoreRepository,
    @Inject(TRANSACTION_MANAGER_SERVICE)
    private readonly _transactionManagerService: ITransactionManagerService,
    @InjectDataSource(process.env.WRITE_CONNECTION_NAME)
    private readonly _dataSource: DataSource,
  ) {}

  async execute(
    command: UpdateStatusCommand,
  ): Promise<ResponseResult<StoreOrmEntity>> {
    return await this._transactionManagerService.runInTransaction(
      this._dataSource,
      async (manager) => {
        if (isNaN(command.id)) {
          throw new DomainException(
            'errors.id_must_be_number',
            HttpStatus.BAD_REQUEST,
            { property: `id ${command.id}` },
          );
        }

        await findOneOrFail(
          manager,
          StoreOrmEntity,
          { id: command.id },
          `${command.id}`,
        );

        let status_id: number;
        if (command.dto.status === EnumStoreStatusString.OPEN) {
          status_id = EnumStoreStatus.OPEN;
        } else if (command.dto.status === EnumStoreStatusString.CLOSE) {
          status_id = EnumStoreStatus.CLOSE;
        } else {
          status_id = EnumStoreStatus.PENDING;
        }

        return await this._write.updateStatus(command.id, status_id, manager);
      },
    );
  }
}
