import { Module } from '@nestjs/common';
import { UserModule } from './users/user.module';
import { AuthModule } from './users/auth/auth.module';
import { BannerModule } from './banners/banner.module';
import { BrandModule } from './productBrand/product-brand.module';

@Module({
  imports: [UserModule, AuthModule, BannerModule, BrandModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class IndexModule {}
