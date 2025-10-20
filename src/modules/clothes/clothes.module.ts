import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClothesOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/clothe.orm';
import { ClothesService } from './services/clothes.service';
import { ClothesController } from './controllers/clothes.controller';
import { CLOTHES_SERVICE } from '@src/common/constants/inject-key';
import { IClothesServiceInterface } from './interfaces/service.interface';

@Module({
  imports: [TypeOrmModule.forFeature([ClothesOrmEntity])],
  controllers: [ClothesController],
  providers: [
    {
      provide: CLOTHES_SERVICE,
      useClass: ClothesService,
    },
  ],
  exports: [
    {
      provide: CLOTHES_SERVICE,
      useClass: ClothesService,
    },
  ],
})
export class ClothesModule {}