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
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CLOTHES_SERVICE } from '@src/common/constants/inject-key';
import { IClothesServiceInterface } from '../interfaces/service.interface';
import { ClothesOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/clothe.orm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { CreateClothesDto } from '../dtos/create.dto';
import { ClothesQueryDto } from '../dtos/query/query.dto';
import { UpdateClothesDto } from '../dtos/update.dto';

@ApiTags('clothes')
@Controller('clothes')
export class ClothesController {
  constructor(
    @Inject(CLOTHES_SERVICE)
    private readonly _service: IClothesServiceInterface,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new clothing item' })
  @ApiResponse({
    status: 201,
    description: 'Clothing item created successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(
    @Body() body: CreateClothesDto,
  ): Promise<ResponseResult<ClothesOrmEntity>> {
    return await this._service.create(body);
  }

  @Get()
  @ApiOperation({ summary: 'Get all clothing items with pagination' })
  @ApiResponse({
    status: 200,
    description: 'Clothing items retrieved successfully',
  })
  async getAll(
    @Query() query: ClothesQueryDto,
  ): Promise<ResponseResult<ClothesOrmEntity>> {
    return await this._service.getAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get clothing item by ID' })
  @ApiParam({ name: 'id', description: 'Clothing item ID' })
  @ApiResponse({
    status: 200,
    description: 'Clothing item retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Clothing item not found' })
  async getOne(
    @Param('id') id: number,
  ): Promise<ResponseResult<ClothesOrmEntity>> {
    return await this._service.getOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update clothing item by ID' })
  @ApiParam({ name: 'id', description: 'Clothing item ID' })
  @ApiResponse({
    status: 200,
    description: 'Clothing item updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Clothing item not found' })
  async update(
    @Param('id') id: number,
    @Body() body: UpdateClothesDto,
  ): Promise<ResponseResult<ClothesOrmEntity>> {
    return await this._service.update(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete clothing item by ID' })
  @ApiParam({ name: 'id', description: 'Clothing item ID' })
  @ApiResponse({
    status: 200,
    description: 'Clothing item deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Clothing item not found' })
  async delete(@Param('id') id: number): Promise<void> {
    return await this._service.delete(id);
  }
}
