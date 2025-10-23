import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/customer.orm';
import { WashingMachineOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/washing-machine.orm';
import { CustomerService } from './services/customer.service';
import { CustomerController } from './controllers/customer.controller';
import { CUSTOMER_SERVICE } from '@src/common/constants/inject-key';
import { ICustomerServiceInterface } from './interfaces/service.interface';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CustomerOrmEntity,
      WashingMachineOrmEntity,
    ])
  ],
  controllers: [CustomerController],
  providers: [
    {
      provide: CUSTOMER_SERVICE,
      useClass: CustomerService,
    },
  ],
  exports: [
    {
      provide: CUSTOMER_SERVICE,
      useClass: CustomerService,
    },
  ],
})
export class CustomerModule {}