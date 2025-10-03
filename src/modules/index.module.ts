import { Module } from '@nestjs/common';
import { UserModule } from './users/user.module';
import { AuthModule } from './users/auth/auth.module';
import { BannerModule } from './banners/banner.module';
import { BrandModule } from './productBrand/product-brand.module';
import { SupplierModule } from './suppliers/supplier.module';
import { TagModule } from './tags/tag.module';
import { TaxModule } from './tax/tax.module';
import { StoreModule } from './stores/store.module';
import { CategoryModule } from './category/category.module';
import { ProvinceModule } from './provinces/province.module';
import { DistrictModule } from './districts/district.module';
import { VillageModule } from './villages/village.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    BannerModule,
    BrandModule,
    SupplierModule,
    TagModule,
    TaxModule,
    StoreModule,
    CategoryModule,
    ProvinceModule,
    DistrictModule,
    VillageModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class IndexModule {}
