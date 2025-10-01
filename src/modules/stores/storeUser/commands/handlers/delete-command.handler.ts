import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteStoreUserCommand } from '../delete.command';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { StoreUserOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/store-user.orm';
import { HttpStatus, Inject } from '@nestjs/common';
import { IWriteStoreUserRepository } from '../../interfaces/repository.interface';
import {
  TRANSACTION_MANAGER_SERVICE,
  WRITE_STORE_USER_REPOSITORY,
  WRITE_USER_REPOSITORY,
} from '@src/common/constants/inject-key';
import { IWriteUserRepository } from '@src/modules/users/interfaces/repository.interface';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { ITransactionManagerService } from '@src/common/infrastructure/transaction/transaction.interface';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { DomainException } from '@src/common/exceptions/domain.exception';

@CommandHandler(DeleteStoreUserCommand)
export class DeleteHandler
  implements ICommandHandler<DeleteStoreUserCommand, ResponseResult<void>>
{
  constructor(
    @Inject(WRITE_STORE_USER_REPOSITORY)
    private readonly _write: IWriteStoreUserRepository,
    @Inject(WRITE_USER_REPOSITORY)
    private readonly _writeUser: IWriteUserRepository,
    @Inject(TRANSACTION_MANAGER_SERVICE)
    private readonly _transactionManagerService: ITransactionManagerService,
    @InjectDataSource(process.env.WRITE_CONNECTION_NAME)
    private readonly _dataSource: DataSource,
  ) {}

  async execute(
    command: DeleteStoreUserCommand,
  ): Promise<ResponseResult<void>> {
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

        const store_user = await findOneOrFail(
          manager,
          StoreUserOrmEntity,
          {
            id: command.id,
          },
          `id ${command.id}`,
        );

        if (!store_user) {
          throw new DomainException('errors.not_found', HttpStatus.NOT_FOUND, {
            property: `id ${command.id}`,
          });
        }

        const id = store_user.user_id;
        if (!id) {
          throw new DomainException('errors.not_found', HttpStatus.NOT_FOUND, {
            property: `id ${command.id}`,
          });
        }

        await this._writeUser.delete(id, manager);

        return await this._write.delete(command.id, manager);
      },
    );
  }
}
