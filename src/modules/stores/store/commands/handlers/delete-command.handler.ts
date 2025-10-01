import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteCommand } from '../delete.command';
import { WRITE_STORE_REPOSITORY } from '@src/common/constants/inject-key';
import { HttpStatus, Inject } from '@nestjs/common';
import { IWriteStoreRepository } from '../../interfaces/repository.interface';
import { DomainException } from '@src/common/exceptions/domain.exception';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { StoreOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/store.orm';
import { EnumStoreStatus } from '@src/common/enums/orm-entity-method.enum';

@CommandHandler(DeleteCommand)
export class DeleteHandler implements ICommandHandler<DeleteCommand, void> {
  constructor(
    @Inject(WRITE_STORE_REPOSITORY)
    private readonly _write: IWriteStoreRepository,
  ) {}

  async execute(command: DeleteCommand): Promise<void> {
    if (isNaN(command.id)) {
      throw new DomainException(
        'errors.id_must_be_number',
        HttpStatus.BAD_REQUEST,
        {
          property: `id ${command.id}`,
        },
      );
    }

    const store = await findOneOrFail(
      command.manager,
      StoreOrmEntity,
      { id: command.id },
      `${command.id}`,
    );

    const status = store.store_status_id;
    if (status === EnumStoreStatus.OPEN) {
      throw new DomainException(
        'errors.store_is_open',
        HttpStatus.BAD_REQUEST,
        {
          property: `${store.name}`,
        },
      );
    }
    return await this._write.delete(command.id, command.manager);
  }
}
