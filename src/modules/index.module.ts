import { Module } from '@nestjs/common';
import { UserModule } from './users/user.module';
import { AuthModule } from './users/auth/auth.module';
import { BannerModule } from './banners/banner.module';
import { StoreModule } from './stores/store.module';
import { ClothesModule } from './clothes/clothes.module';

@Module({
  imports: [UserModule, AuthModule, BannerModule, StoreModule, ClothesModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class IndexModule {}
