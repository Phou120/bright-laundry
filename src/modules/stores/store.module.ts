import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { StoreController } from './store/controllers/store.controller';
import { storeProvider } from './store/providers';
import { StoreUserModule } from './storeUser/store-user.module';
import { StoreOpenCloseTimeModule } from './storeOpenCloseTime/store-open-close-item.module';

@Module({
  imports: [CqrsModule, StoreUserModule, StoreOpenCloseTimeModule],
  controllers: [StoreController],
  providers: [...storeProvider],
  exports: [...storeProvider],
})
export class StoreModule {}
