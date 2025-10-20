import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BannerOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/banner.orm';
import { BannerService } from './services/banner.service';
import { BannerController } from './controllers/banner.controller';
import { BANNER_SERVICE } from '@src/common/constants/inject-key';

@Module({
  imports: [TypeOrmModule.forFeature([BannerOrmEntity])],
  controllers: [BannerController],
  providers: [
    {
      provide: BANNER_SERVICE,
      useClass: BannerService,
    },
  ],
  exports: [
    {
      provide: BANNER_SERVICE,
      useClass: BannerService,
    },
  ],
})
export class BannerModule {}
