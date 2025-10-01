import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateCommand } from '../create.command';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { StoreOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/store.orm';
import { HttpStatus, Inject } from '@nestjs/common';
import {
  E_COMMERCE,
  MAX_GENERATE_CODE_LENGTH,
  TRANSACTION_MANAGER_SERVICE,
  WRITE_OPEN_CLOSE_STORE_REPOSITORY,
  WRITE_STORE_REPOSITORY,
  WRITE_STORE_USER_REPOSITORY,
  WRITE_USER_REPOSITORY,
} from '@src/common/constants/inject-key';
import { ITransactionManagerService } from '@src/common/infrastructure/transaction/transaction.interface';
import { DataSource, EntityManager } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { _checkColumnDuplicate } from '@src/common/utils/check-column-duplicate-orm.util';
import { IWriteStoreRepository } from '../../interfaces/repository.interface';
import { UserOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/user.orm';
import { hashPassword } from '@src/common/utils/hash-password';
import { IWriteUserRepository } from '@src/modules/users/interfaces/repository.interface';
import { generateUniqueNo } from '@src/common/utils/generate-code.util';
import { CreateDto } from '@src/modules/users/dtos/create.dto';
import { IWriteStoreUserRepository } from '@src/modules/stores/storeUser/interfaces/repository.interface';
import { IWriteOpenCloseStoreRepository } from '@src/modules/stores/storeOpenCloseTime/interfaces/repository.interface';
import { RoleOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/role.orm';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { VillageOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/village.orm';
import { DomainException } from '@src/common/exceptions/domain.exception';
import { TaxOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/tax.orm';

@CommandHandler(CreateCommand)
export class CreateHandler
  implements ICommandHandler<CreateCommand, ResponseResult<StoreOrmEntity>>
{
  constructor(
    @Inject(WRITE_STORE_REPOSITORY)
    private readonly _write: IWriteStoreRepository,
    @Inject(WRITE_USER_REPOSITORY)
    private readonly _writeUser: IWriteUserRepository,
    @Inject(WRITE_STORE_USER_REPOSITORY)
    private readonly _writeStoreUser: IWriteStoreUserRepository,
    @Inject(WRITE_OPEN_CLOSE_STORE_REPOSITORY)
    private readonly _writeOpenCloseStore: IWriteOpenCloseStoreRepository,
    @Inject(TRANSACTION_MANAGER_SERVICE)
    private readonly _transactionManagerService: ITransactionManagerService,
    @InjectDataSource(process.env.WRITE_CONNECTION_NAME)
    private readonly _dataSource: DataSource,
  ) {}

  async execute(
    command: CreateCommand,
  ): Promise<ResponseResult<StoreOrmEntity>> {
    return await this._transactionManagerService.runInTransaction(
      this._dataSource,
      async (manager) => {
        const code = await this.generateUniqueCustomerCode(manager);
        await _checkColumnDuplicate(
          UserOrmEntity,
          'email',
          command.dto.email,
          manager,
          'errors.email_already_exists',
        );

        await _checkColumnDuplicate(
          StoreOrmEntity,
          'name',
          command.dto.store_name,
          manager,
          'errors.name_already_exists',
        );

        await _checkColumnDuplicate(
          StoreOrmEntity,
          'phone_number',
          command.dto.phone_number,
          manager,
          'errors.tel_already_exists',
        );

        await _checkColumnDuplicate(
          StoreOrmEntity,
          'public_email',
          command.dto.public_email,
          manager,
          'errors.email_already_exists',
        );

        const tax = await this.getTax(manager);
        if (!tax) {
          throw new DomainException('errors.not_found', HttpStatus.NOT_FOUND, {
            property: `tax`,
          });
        }
        const tax_id = tax.id;

        const userData = command.dto as unknown as CreateDto;

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

        const role_name = 'storemanager';
        await findOneOrFail(
          manager,
          RoleOrmEntity,
          {
            name: role_name,
          },
          `${role_name}`,
        );
        const hashedPassword = await hashPassword(command.dto.password);
        const user = await this._writeUser.createStoreUser(
          userData,
          hashedPassword,
          manager,
          code,
          role_name,
        );

        const user_id = (user as UserOrmEntity).id;

        const store = await this._write.create(command.dto, tax_id, manager);

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

        await this._writeOpenCloseStore.create(store_id, command.dto, manager);

        await this._writeStoreUser.create(user_id, store_id, manager);

        return store;
      },
    );
  }

  async generateUniqueCustomerCode(manager: EntityManager): Promise<string> {
    return generateUniqueNo(
      MAX_GENERATE_CODE_LENGTH,
      async (code) => {
        const existing = await manager.findOne(UserOrmEntity, {
          where: { user_no: code },
        });
        return !!existing;
      },
      E_COMMERCE,
    );
  }

  async getTax(manager: EntityManager) {
    return await manager.createQueryBuilder(TaxOrmEntity, 'tax').getOne();
  }
}
