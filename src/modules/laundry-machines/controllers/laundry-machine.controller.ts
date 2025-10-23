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
import { LAUNDRY_MACHINE_SERVICE } from '@src/common/constants/inject-key';
import { ILaundryMachineServiceInterface } from '../interfaces/service.interface';
import { LaundryMachineOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/laundry-machine.orm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { CreateLaundryMachineDto } from '../dtos/create.dto';
import { LaundryMachineQueryDto } from '../dtos/query/query.dto';
import { UpdateLaundryMachineDto } from '../dtos/update.dto';

@ApiTags('laundry-machines')
@Controller('laundry-machines')
export class LaundryMachineController {
  constructor(
    @Inject(LAUNDRY_MACHINE_SERVICE)
    private readonly _service: ILaundryMachineServiceInterface,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new laundry machine' })
  @ApiResponse({
    status: 201,
    description: 'Laundry machine created successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(
    @Body() body: CreateLaundryMachineDto,
  ): Promise<ResponseResult<LaundryMachineOrmEntity>> {
    return await this._service.create(body);
  }

  @Get()
  @ApiOperation({ summary: 'Get all laundry machines with pagination' })
  @ApiResponse({
    status: 200,
    description: 'Laundry machines retrieved successfully',
  })
  async getAll(
    @Query() query: LaundryMachineQueryDto,
  ): Promise<ResponseResult<LaundryMachineOrmEntity>> {
    return await this._service.getAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get laundry machine by ID' })
  @ApiParam({ name: 'id', description: 'Laundry machine ID' })
  @ApiResponse({
    status: 200,
    description: 'Laundry machine retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Laundry machine not found' })
  async getOne(
    @Param('id') id: number,
  ): Promise<ResponseResult<LaundryMachineOrmEntity>> {
    return await this._service.getOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update laundry machine by ID' })
  @ApiParam({ name: 'id', description: 'Laundry machine ID' })
  @ApiResponse({
    status: 200,
    description: 'Laundry machine updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Laundry machine not found' })
  async update(
    @Param('id') id: number,
    @Body() body: UpdateLaundryMachineDto,
  ): Promise<ResponseResult<LaundryMachineOrmEntity>> {
    return await this._service.update(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete laundry machine by ID' })
  @ApiParam({ name: 'id', description: 'Laundry machine ID' })
  @ApiResponse({
    status: 200,
    description: 'Laundry machine deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Laundry machine not found' })
  async delete(@Param('id') id: number): Promise<void> {
    return await this._service.delete(id);
  }
}
