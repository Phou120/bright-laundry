import { Module } from '@nestjs/common';
import { UserModule } from './users/user.module';
import { AuthModule } from './users/auth/auth.module';
import { BannerModule } from './banners/banner.module';
import { StoreModule } from './stores/store.module';
import { ClothesModule } from './clothes/clothes.module';
import { LaundryMachineModule } from './laundry-machines/laundry-machine.module';
import { CustomerModule } from './customers/customer.module';
import { TaxModule } from './taxes/tax.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    BannerModule,
    StoreModule,
    ClothesModule,
    LaundryMachineModule,
    CustomerModule,
    TaxModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class IndexModule {}
