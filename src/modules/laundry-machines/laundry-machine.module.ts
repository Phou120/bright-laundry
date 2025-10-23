import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LaundryMachineOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/laundry-machine.orm';
import { LaundryMachineService } from './services/laundry-machine.service';
import { LaundryMachineController } from './controllers/laundry-machine.controller';
import { LAUNDRY_MACHINE_SERVICE } from '@src/common/constants/inject-key';
import { ILaundryMachineServiceInterface } from './interfaces/service.interface';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LaundryMachineOrmEntity,
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