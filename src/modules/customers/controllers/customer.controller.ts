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
import { CUSTOMER_SERVICE } from '@src/common/constants/inject-key';
import { ICustomerServiceInterface } from '../interfaces/service.interface';
import { CustomerOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/customer.orm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { CreateCustomerDto } from '../dtos/create.dto';
import { CustomerQueryDto } from '../dtos/query/query.dto';
import { UpdateCustomerDto } from '../dtos/update.dto';

@ApiTags('customers')
@Controller('customers')
export class CustomerController {
  constructor(
    @Inject(CUSTOMER_SERVICE)
    private readonly _service: ICustomerServiceInterface,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new customer' })
  @ApiResponse({
    status: 201,
    description: 'Customer created successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(
    @Body() body: CreateCustomerDto,
  ): Promise<ResponseResult<CustomerOrmEntity>> {
    return await this._service.create(body);
  }

  @Get()
  @ApiOperation({ summary: 'Get all customers with pagination' })
  @ApiResponse({
    status: 200,
    description: 'Customers retrieved successfully',
  })
  async getAll(
    @Query() query: CustomerQueryDto,
  ): Promise<ResponseResult<CustomerOrmEntity>> {
    return await this._service.getAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get customer by ID' })
  @ApiParam({ name: 'id', description: 'Customer ID' })
  @ApiResponse({
    status: 200,
    description: 'Customer retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  async getOne(
    @Param('id') id: number,
  ): Promise<ResponseResult<CustomerOrmEntity>> {
    return await this._service.getOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update customer by ID' })
  @ApiParam({ name: 'id', description: 'Customer ID' })
  @ApiResponse({
    status: 200,
    description: 'Customer updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  async update(
    @Param('id') id: number,
    @Body() body: UpdateCustomerDto,
  ): Promise<ResponseResult<CustomerOrmEntity>> {
    return await this._service.update(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete customer by ID' })
  @ApiParam({ name: 'id', description: 'Customer ID' })
  @ApiResponse({
    status: 200,
    description: 'Customer deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  async delete(@Param('id') id: number): Promise<void> {
    return await this._service.delete(id);
  }
}