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
import { CATEGORY_SERVICE } from '@src/common/constants/inject-key';
import { ICategoryServiceInterface } from '../interfaces/service.interface';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { ProductCategoryOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/product-categoy.orm';
import { CreateDto } from '../dtos/create/create.dto';
import { UpdateDto } from '../dtos/create/update.dto';
import { CategoryQueryDto } from '../dtos/query/query.dto';

@Controller('categories')
export class CategoryController {
  constructor(
    @Inject(CATEGORY_SERVICE)
    private readonly _service: ICategoryServiceInterface,
  ) {}

  @Post()
  async create(
    @Body() body: CreateDto,
  ): Promise<ResponseResult<ProductCategoryOrmEntity>> {
    return await this._service.create(body);
  }

  @Get()
  async getAll(
    @Query() query: CategoryQueryDto,
  ): Promise<ResponseResult<ProductCategoryOrmEntity>> {
    return await this._service.getAll(query);
  }

  @Get(':id')
  async getById(
    @Param('id') id: number,
  ): Promise<ResponseResult<ProductCategoryOrmEntity>> {
    return await this._service.getById(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() body: UpdateDto,
  ): Promise<ResponseResult<ProductCategoryOrmEntity>> {
    return await this._service.update(id, body);
  }

  @Delete(':id')
  async delete(
    @Param('id') id: number,
  ): Promise<ResponseResult<ProductCategoryOrmEntity>> {
    return await this._service.delete(id);
  }
}
