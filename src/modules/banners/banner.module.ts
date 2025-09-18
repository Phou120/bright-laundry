import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { BannerController } from './controllers/banner.controller';
import { bannerProvider } from './providers';

@Module({
  imports: [CqrsModule],
  controllers: [BannerController],
  providers: [...bannerProvider],
  exports: [...bannerProvider],
})
export class BannerModule {}
