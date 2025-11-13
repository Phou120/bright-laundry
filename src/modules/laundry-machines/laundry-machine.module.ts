import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WashingMachineOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/washing-machine.orm';
import { WashingMachineDetailOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/washing-machine-detail.orm';
import { LaundryMachineService } from './services/laundry-machine.service';
import { LaundryMachineController } from './controllers/laundry-machine.controller';
import { LAUNDRY_MACHINE_SERVICE } from '@src/common/constants/inject-key';
import { ILaundryMachineServiceInterface } from './interfaces/service.interface';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      WashingMachineOrmEntity,
      WashingMachineDetailOrmEntity,
    ])
  ],
  controllers: [LaundryMachineController],
  providers: [
    {
      provide: LAUNDRY_MACHINE_SERVICE,
      useClass: LaundryMachineService,
    },
  ],
  exports: [
    {
      provide: LAUNDRY_MACHINE_SERVICE,
      useClass: LaundryMachineService,
    },
  ],
})
export class LaundryMachineModule {}