import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateCommand } from '../update.command';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { TagOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/tag.orm';
import { HttpStatus, Inject } from '@nestjs/common';
import {
  TRANSACTION_MANAGER_SERVICE,
  WRITE_TAG_REPOSITORY,
} from '@src/common/constants/inject-key';
import { IWriteTagRepository } from '../../interfaces/repository.interface';
import { ITransactionManagerService } from '@src/common/infrastructure/transaction/transaction.interface';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { _checkColumnDuplicate } from '@src/common/utils/check-column-duplicate-orm.util';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { DomainException } from '@src/common/exceptions/domain.exception';

@CommandHandler(UpdateCommand)
export class UpdateHandler
  implements ICommandHandler<UpdateCommand, ResponseResult<TagOrmEntity>>
{
  constructor(
    @Inject(WRITE_TAG_REPOSITORY)
    private readonly _write: IWriteTagRepository,
    @Inject(TRANSACTION_MANAGER_SERVICE)
    private readonly _transactionManagerService: ITransactionManagerService,
    @InjectDataSource(process.env.WRITE_CONNECTION_NAME)
    private readonly _dataSource: DataSource,
  ) {}

  async execute(command: UpdateCommand): Promise<ResponseResult<TagOrmEntity>> {
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
          TagOrmEntity,
          { id: command.id },
          `${command.id}`,
        );

        await _checkColumnDuplicate(
          TagOrmEntity,
          'name',
          command.body.name,
          manager,
          'errors.name_already_exists',
          command.id,
        );

        return await this._write.update(command.id, command.body, manager);
      },
    );
  }
}
