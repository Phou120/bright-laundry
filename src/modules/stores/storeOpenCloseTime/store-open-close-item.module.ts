import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { storeOpenCloseTimeProvider } from './providers';

@Module({
  imports: [CqrsModule],
  controllers: [],
  providers: [...storeOpenCloseTimeProvider],
  exports: [...storeOpenCloseTimeProvider],
})
export class StoreOpenCloseTimeModule {}
