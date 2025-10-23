import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaxOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/tax.orm';
import { StoreOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/store.orm';
import { TaxService } from './services/tax.service';
import { TaxController } from './controllers/tax.controller';
import { TAX_SERVICE } from '@src/common/constants/inject-key';
import { ITaxServiceInterface } from './interfaces/service.interface';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TaxOrmEntity,
      StoreOrmEntity,
    ])
  ],
  controllers: [TaxController],
  providers: [
    {
      provide: TAX_SERVICE,
      useClass: TaxService,
    },
  ],
  exports: [
    {
      provide: TAX_SERVICE,
      useClass: TaxService,
    },
  ],
})
export class TaxModule {}