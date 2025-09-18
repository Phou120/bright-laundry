import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteCommand } from '../delete.command';
import { WRITE_BANNER_REPOSITORY } from '@src/common/constants/inject-key';
import { HttpStatus, Inject } from '@nestjs/common';
import { IWriteBannerRepository } from '../../interfaces/repository.interface';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { BannerOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/banner.orm';
import { DomainException } from '@src/common/exceptions/domain.exception';

@CommandHandler(DeleteCommand)
export class DeleteHandler implements ICommandHandler<DeleteCommand, void> {
  constructor(
    @Inject(WRITE_BANNER_REPOSITORY)
    private readonly _write: IWriteBannerRepository,
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
    await findOneOrFail(
      command.manager,
      BannerOrmEntity,
      { id: command.id },
      `${command.id}`,
    );
    return await this._write.delete(command.id, command.manager);
  }
}
