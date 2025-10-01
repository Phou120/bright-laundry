import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { StoreOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/store.orm';
import { HttpStatus, Inject } from '@nestjs/common';
import {
  TRANSACTION_MANAGER_SERVICE,
  WRITE_OPEN_CLOSE_STORE_REPOSITORY,
  WRITE_STORE_REPOSITORY,
  WRITE_USER_REPOSITORY,
} from '@src/common/constants/inject-key';
import { ITransactionManagerService } from '@src/common/infrastructure/transaction/transaction.interface';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { _checkColumnDuplicate } from '@src/common/utils/check-column-duplicate-orm.util';
import { IWriteStoreRepository } from '../../interfaces/repository.interface';
import { UserOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/user.orm';
import { hashPassword } from '@src/common/utils/hash-password';
import { IWriteUserRepository } from '@src/modules/users/interfaces/repository.interface';
import { IWriteOpenCloseStoreRepository } from '@src/modules/stores/storeOpenCloseTime/interfaces/repository.interface';
import { RoleOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/role.orm';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { VillageOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/village.orm';
import { DomainException } from '@src/common/exceptions/domain.exception';
import { UpdateCommand } from '../update.command';
import { StoreUserOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/store-user.orm';
import { UpdateDto } from '@src/modules/users/dtos/update.dto';

@CommandHandler(UpdateCommand)
export class UpdateCommandHandler
  implements ICommandHandler<UpdateCommand, ResponseResult<StoreOrmEntity>>
{
  constructor(
    @Inject(WRITE_STORE_REPOSITORY)
    private readonly _write: IWriteStoreRepository,
    @Inject(WRITE_USER_REPOSITORY)
    private readonly _writeUser: IWriteUserRepository,
    @Inject(WRITE_OPEN_CLOSE_STORE_REPOSITORY)
    private readonly _writeOpenCloseStore: IWriteOpenCloseStoreRepository,
    @Inject(TRANSACTION_MANAGER_SERVICE)
    private readonly _transactionManagerService: ITransactionManagerService,
    @InjectDataSource(process.env.WRITE_CONNECTION_NAME)
    private readonly _dataSource: DataSource,
  ) {}

  async execute(
    command: UpdateCommand,
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
        const existingStore = await findOneOrFail(
          manager,
          StoreOrmEntity,
          { id: command.id },
          `${command.id}`,
        );

        const store_user = await findOneOrFail(
          manager,
          StoreUserOrmEntity,
          { id: existingStore.id },
          `Store user ${existingStore.id}`,
        );

        const existingUser = await findOneOrFail(
          manager,
          UserOrmEntity,
          { id: store_user.user_id },
          `User ${store_user.user_id}`,
        );
        await _checkColumnDuplicate(
          UserOrmEntity,
          'email',
          command.dto.email,
          manager,
          'errors.email_already_exists',
          existingUser.id,
        );

        await _checkColumnDuplicate(
          StoreOrmEntity,
          'name',
          command.dto.store_name,
          manager,
          'errors.name_already_exists',
          command.id,
        );

        await _checkColumnDuplicate(
          StoreOrmEntity,
          'phone_number',
          command.dto.phone_number,
          manager,
          'errors.tel_already_exists',
          command.id,
        );

        await _checkColumnDuplicate(
          StoreOrmEntity,
          'public_email',
          command.dto.public_email,
          manager,
          'errors.email_already_exists',
          command.id,
        );

        const userData = command.dto as unknown as UpdateDto;

        await findOneOrFail(
          manager,
          RoleOrmEntity,
          {
            name: 'storemanager',
          },
          `Role storemanager`,
        );

        await findOneOrFail(
          manager,
          VillageOrmEntity,
          {
            id: command.dto.village_id,
          },
          `Village ${command.dto.village_id}`,
        );

        let hashedPassword: string | undefined = undefined;
        if (command.dto.password) {
          hashedPassword = await hashPassword(command.dto.password);
        }
        const user = await this._writeUser.updateStoreUser(
          existingUser.id,
          userData,
          manager,
          hashedPassword,
        );

        const user_id = (user as UserOrmEntity).id;

        const store = await this._write.update(
          command.id,
          command.dto,
          manager,
        );

        const store_id = (store as StoreOrmEntity).id;

        // verify created user and store exist in the same transaction before linking
        await findOneOrFail(
          manager,
          UserOrmEntity,
          { id: user_id },
          `User ${user_id}`,
        );

        await findOneOrFail(
          manager,
          StoreOrmEntity,
          { id: store_id },
          `Store ${store_id}`,
        );

        await this._writeOpenCloseStore.update(store_id, command.dto, manager);

        return store;
      },
    );
  }
}
