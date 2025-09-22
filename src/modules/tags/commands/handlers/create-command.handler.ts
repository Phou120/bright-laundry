import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateCommand } from '../create.command';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { TagOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/tag.orm';
import {
  TRANSACTION_MANAGER_SERVICE,
  WRITE_TAG_REPOSITORY,
} from '@src/common/constants/inject-key';
import { Inject } from '@nestjs/common';
import { ITransactionManagerService } from '@src/common/infrastructure/transaction/transaction.interface';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { _checkColumnDuplicate } from '@src/common/utils/check-column-duplicate-orm.util';
import { IWriteTagRepository } from '../../interfaces/repository.interface';

@CommandHandler(CreateCommand)
export class CreateHandler
  implements ICommandHandler<CreateCommand, ResponseResult<TagOrmEntity>>
{
  constructor(
    @Inject(WRITE_TAG_REPOSITORY)
    private readonly _write: IWriteTagRepository,
    @Inject(TRANSACTION_MANAGER_SERVICE)
    private readonly _transactionManagerService: ITransactionManagerService,
    @InjectDataSource(process.env.WRITE_CONNECTION_NAME)
    private readonly _dataSource: DataSource,
  ) {}

  async execute(command: CreateCommand): Promise<ResponseResult<TagOrmEntity>> {
    return await this._transactionManagerService.runInTransaction(
      this._dataSource,
      async (manager) => {
        await _checkColumnDuplicate(
          TagOrmEntity,
          'name',
          command.body.name,
          manager,
          'errors.name_already_exists',
        );

        return await this._write.create(command.body, manager);
      },
    );
  }
}
