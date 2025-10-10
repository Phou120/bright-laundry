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
import { PRODUCT_ATTRIBUTE_SERVICE } from '@src/common/constants/inject-key';
import { IProductAttributeServiceInterface } from '../interfaces/service.interface';
import { CreateDto } from '../dtos/create/create.dto';
import { ProductAttributeOrmEntity } from '../../../common/infrastructure/database/typeorms/entities/product-attribute.orm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { ProductAttributeQueryDto } from '../dtos/query/query.dto';
import { UpdateDto } from '../dtos/create/update.dto';

@Controller('product-attributes')
export class ProductAttributeController {
  constructor(
    @Inject(PRODUCT_ATTRIBUTE_SERVICE)
    private readonly _service: IProductAttributeServiceInterface,
  ) {}

  @Post()
  async create(
    @Body() dto: CreateDto,
  ): Promise<ResponseResult<ProductAttributeOrmEntity>> {
    return await this._service.create(dto);
  }

  @Put('/:id')
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateDto,
  ): Promise<ResponseResult<ProductAttributeOrmEntity>> {
    return await this._service.update(id, dto);
  }

  @Get()
  async getAll(
    @Query() query: ProductAttributeQueryDto,
  ): Promise<ResponseResult<ProductAttributeOrmEntity>> {
    return await this._service.getAll(query);
  }

  @Get(':id')
  async getById(
    @Param('id') id: number,
  ): Promise<ResponseResult<ProductAttributeOrmEntity>> {
    return await this._service.getById(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    await this._service.delete(id);
  }
}
