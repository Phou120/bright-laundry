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
import { TAX_SERVICE } from '@src/common/constants/inject-key';
import { ITaxServiceInterface } from '../interfaces/service.interface';
import { TaxOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/tax.orm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { CreateTaxDto } from '../dtos/create.dto';
import { TaxQueryDto } from '../dtos/query/query.dto';
import { UpdateTaxDto } from '../dtos/update.dto';

@ApiTags('taxes')
@Controller('taxes')
export class TaxController {
  constructor(
    @Inject(TAX_SERVICE)
    private readonly _service: ITaxServiceInterface,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new tax' })
  @ApiResponse({
    status: 201,
    description: 'Tax created successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(
    @Body() body: CreateTaxDto,
  ): Promise<ResponseResult<TaxOrmEntity>> {
    return await this._service.create(body);
  }

  @Get()
  @ApiOperation({ summary: 'Get all taxes with pagination' })
  @ApiResponse({
    status: 200,
    description: 'Taxes retrieved successfully',
  })
  async getAll(
    @Query() query: TaxQueryDto,
  ): Promise<ResponseResult<TaxOrmEntity>> {
    return await this._service.getAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get tax by ID' })
  @ApiParam({ name: 'id', description: 'Tax ID' })
  @ApiResponse({
    status: 200,
    description: 'Tax retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Tax not found' })
  async getOne(
    @Param('id') id: number,
  ): Promise<ResponseResult<TaxOrmEntity>> {
    return await this._service.getOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update tax by ID' })
  @ApiParam({ name: 'id', description: 'Tax ID' })
  @ApiResponse({
    status: 200,
    description: 'Tax updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Tax not found' })
  async update(
    @Param('id') id: number,
    @Body() body: UpdateTaxDto,
  ): Promise<ResponseResult<TaxOrmEntity>> {
    return await this._service.update(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete tax by ID' })
  @ApiParam({ name: 'id', description: 'Tax ID' })
  @ApiResponse({
    status: 200,
    description: 'Tax deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Tax not found' })
  async delete(@Param('id') id: number): Promise<void> {
    return await this._service.delete(id);
  }
}