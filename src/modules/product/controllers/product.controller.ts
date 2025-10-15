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
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { IProductServiceInterface } from '../interfaces/service.interface';
import { CreateProductDto } from '../dtos/create/create.dto';
import { ProductOrmEntity } from '../../../common/infrastructure/database/typeorms/entities/product.orm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { ProductQueryDto } from '../dtos/query/query.dto';
import { UpdateProductDto } from '../dtos/create/update.dto';

@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(
    @Inject('PRODUCT_SERVICE')
    private readonly _service: IProductServiceInterface,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  async create(
    @Body() dto: CreateProductDto,
  ): Promise<ResponseResult<ProductOrmEntity>> {
    return await this._service.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a product' })
  @ApiResponse({ status: 200, description: 'Product updated successfully' })
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateProductDto,
  ): Promise<ResponseResult<ProductOrmEntity>> {
    return await this._service.update(id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all products with pagination and filters' })
  @ApiResponse({ status: 200, description: 'Products retrieved successfully' })
  async getAll(
    @Query() query: ProductQueryDto,
  ): Promise<ResponseResult<ProductOrmEntity>> {
    return await this._service.getAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiResponse({ status: 200, description: 'Product retrieved successfully' })
  async getById(
    @Param('id') id: number,
  ): Promise<ResponseResult<ProductOrmEntity>> {
    return await this._service.getById(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product' })
  @ApiResponse({ status: 200, description: 'Product deleted successfully' })
  async delete(@Param('id') id: number): Promise<void> {
    await this._service.delete(id);
  }
}
