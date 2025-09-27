import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { taxProvider } from './providers';
import { TaxController } from './controllers/tax.controller';

@Module({
  imports: [CqrsModule],
  controllers: [TaxController],
  providers: [...taxProvider],
  exports: [...taxProvider],
})
export class TaxModule {}
