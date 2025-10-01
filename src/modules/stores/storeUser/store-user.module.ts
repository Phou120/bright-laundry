import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { storeUserProvider } from './providers';
import { StoreUserController } from './controllers/store-user.controller';

@Module({
  imports: [CqrsModule],
  controllers: [StoreUserController],
  providers: [...storeUserProvider],
  exports: [...storeUserProvider],
})
export class StoreUserModule {}
