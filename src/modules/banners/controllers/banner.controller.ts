import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { BANNER_SERVICE } from '@src/common/constants/inject-key';
import { IBannerServiceInterface } from '../interfaces/service.interface';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { BannerOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/banner.orm';
import { CreateDto } from '../dtos/create.dto';
import { BannerQueryDto } from '../dtos/query/query.dto';
import { UpdateDto } from '../dtos/update.dto';
import { UpdateOrderDto } from '../dtos/update-order.dto';

@Controller('banners')
export class BannerController {
  constructor(
    @Inject(BANNER_SERVICE)
    private readonly _service: IBannerServiceInterface,
  ) {}

  @Post()
  async createBanner(
    @Body() body: CreateDto,
  ): Promise<ResponseResult<BannerOrmEntity>> {
    return await this._service.create(body);
  }

  @Put('update-order')
  async updateBannerOrder(
    @Body() body: UpdateOrderDto,
  ): Promise<ResponseResult<BannerOrmEntity[]>> {
    return await this._service.updateOrder(body);
  }

  @Put('/:id')
  async updateBanner(
    @Param('id') id: number,
    @Body() body: UpdateDto,
  ): Promise<ResponseResult<BannerOrmEntity>> {
    return await this._service.update(id, body);
  }

  @Get()
  async getAllBanners(
    @Query() query: BannerQueryDto,
  ): Promise<ResponseResult<BannerOrmEntity>> {
    return await this._service.getAll(query);
  }

  @Get(':id')
  async getBannerById(
    @Param('id') id: number,
  ): Promise<ResponseResult<BannerOrmEntity>> {
    return await this._service.getById(id);
  }

  @Delete('/:id')
  async deleteBanner(@Param('id') id: number): Promise<void> {
    await this._service.delete(id);
  }
}
