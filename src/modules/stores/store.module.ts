import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/store.orm';
import { UserOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/user.orm';
import { StoreUserOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/store-user.orm';
import { RoleOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/role.orm';
import { StoreService } from './services/store.service';
import { StoreController } from './controllers/store.controller';
import { STORE_SERVICE } from '@src/common/constants/inject-key';
import { IStoreServiceInterface } from './interfaces/service.interface';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StoreOrmEntity,
      UserOrmEntity,
      StoreUserOrmEntity,
      RoleOrmEntity,
    ])
  ],
  controllers: [StoreController],
  providers: [
    {
      provide: STORE_SERVICE,
      useClass: StoreService,
    },
  ],
  exports: [
    {
      provide: STORE_SERVICE,
      useClass: StoreService,
    },
  ],
})
export class StoreModule {}