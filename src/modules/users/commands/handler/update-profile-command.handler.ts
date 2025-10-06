import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateProfileCommand } from '../update-profile.command';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { UserOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/user.orm';
import {
  TRANSACTION_MANAGER_SERVICE,
  WRITE_USER_PROFILE_REPOSITORY,
  WRITE_USER_REPOSITORY,
} from '@src/common/constants/inject-key';
import { HttpStatus, Inject } from '@nestjs/common';
import { IWriteUserRepository } from '../../interfaces/repository.interface';
import { IWriteUserProfileRepository } from '../../interfaces/user-profile.interface';
import { ITransactionManagerService } from '@src/common/infrastructure/transaction/transaction.interface';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';
import { DomainException } from '@src/common/exceptions/domain.exception';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { _checkColumnDuplicate } from '@src/common/utils/check-column-duplicate-orm.util';
import { UpdateProfileDto } from '../../dtos/update-profile.dto';
import { UserProfileOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/user-profile.orm';

@CommandHandler(UpdateProfileCommand)
export class UpdateProfileHandler
  implements
    ICommandHandler<UpdateProfileCommand, ResponseResult<UserOrmEntity>>
{
  constructor(
    @Inject(WRITE_USER_REPOSITORY)
    private readonly _write: IWriteUserRepository,
    @Inject(WRITE_USER_PROFILE_REPOSITORY)
    private readonly _writeUserProfileRepository: IWriteUserProfileRepository,
    @Inject(TRANSACTION_MANAGER_SERVICE)
    private readonly _transactionManagerService: ITransactionManagerService,
    @InjectDataSource(process.env.WRITE_CONNECTION_NAME)
    private readonly _dataSource: DataSource,
  ) {}

  async execute(
    command: UpdateProfileCommand,
  ): Promise<ResponseResult<UserOrmEntity>> {
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
        await findOneOrFail(
          manager,
          UserOrmEntity,
          { id: command.id },
          `${command.id}`,
        );
        await _checkColumnDuplicate(
          UserOrmEntity,
          'email',
          command.body.email,
          manager,
          'errors.email_already_exists',
          command.id,
        );

        await _checkColumnDuplicate(
          UserOrmEntity,
          'tel',
          command.body.tel,
          manager,
          'errors.tel_already_exists',
          command.id,
        );

        const user = await this._write.updateProfile(
          command.id,
          command.body,
          manager,
        );
        const user_id = (user as UserOrmEntity).id;
        await this.updateProfile(user_id, command.body, manager);
        return user;
      },
    );
  }

  private async updateProfile(
    user_id: number,
    body: UpdateProfileDto,
    manager: EntityManager,
  ): Promise<void> {
    try {
      if (body.image) {
        const profile = await findOneOrFail(
          manager,
          UserProfileOrmEntity,
          { user_id: user_id },
          `User ${user_id}`,
        );

        const profile_id = profile.id;
        const merge = body as unknown as UpdateProfileDto;

        await this._writeUserProfileRepository.updateProfile(
          profile_id,
          merge,
          manager,
        );
      }
    } catch (e) {
      console.log(e);
      if (body.image) {
        const profile = body as unknown as UpdateProfileDto;
        await this._writeUserProfileRepository.createUserProfile(
          profile,
          user_id,
          manager,
        );
      }
    }
  }
}
