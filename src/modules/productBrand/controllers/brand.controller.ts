import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { BRAND_SERVICE } from '@src/common/constants/inject-key';
import { IBrandServiceInterface } from '../interfaces/service.interface';
import { CreateDto } from '../dtos/create.dto';
import { ProductBrandOrmEntity } from '../../../common/infrastructure/database/typeorms/entities/product-brand.orm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { ProductBrandQueryDto } from '../dtos/query/query.dto';
import { UpdateDto } from '../dtos/update.dto';

@Controller('brands')
export class BrandController {
  constructor(
    @Inject(BRAND_SERVICE)
    private readonly _service: IBrandServiceInterface,
  ) {}

  @Post()
  async create(
    @Body() dto: CreateDto,
  ): Promise<ResponseResult<ProductBrandOrmEntity>> {
    return await this._service.create(dto);
  }

  @Put('/:id')
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateDto,
  ): Promise<ResponseResult<ProductBrandOrmEntity>> {
    return await this._service.update(id, dto);
  }

  @Get()
  async getAll(
    @Query() query: ProductBrandQueryDto,
  ): Promise<ResponseResult<ProductBrandOrmEntity>> {
    return await this._service.getAll(query);
  }

  @Get(':id')
  async getById(
    @Param('id') id: number,
  ): Promise<ResponseResult<ProductBrandOrmEntity>> {
    return await this._service.getById(id);
  }
}
