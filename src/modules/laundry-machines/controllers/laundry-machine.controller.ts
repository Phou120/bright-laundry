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
import { WashingMachineOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/washing-machine.orm';
import { WashingMachineDetailOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/washing-machine-detail.orm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import {
  CreateLaundryMachineDto,
  CreateWashingMachineDetailDto,
} from '../dtos/create.dto';
import { LaundryMachineQueryDto } from '../dtos/query/query.dto';
import { UpdateLaundryMachineDto } from '../dtos/update.dto';
import { User } from '@src/common/decorator/user.decorator';

@ApiTags('washing-machines')
@Controller('washing-machines')
export class LaundryMachineController {
  constructor(
    @Inject(LAUNDRY_MACHINE_SERVICE)
    private readonly _service: ILaundryMachineServiceInterface,
  ) {}

  @Post()
  async create(
    @User('id') userId: number,
    @Body() body: CreateLaundryMachineDto,
  ): Promise<ResponseResult<WashingMachineOrmEntity>> {
    return await this._service.create(userId, body);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all washing machine orders with pagination and filtering',
  })
  @ApiResponse({
    status: 200,
    description: 'Washing machine orders retrieved successfully',
  })
  async getAll(
    @Query() query: LaundryMachineQueryDto,
  ): Promise<ResponseResult<WashingMachineOrmEntity>> {
    return await this._service.getAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get washing machine order by ID' })
  @ApiParam({ name: 'id', description: 'Washing machine order ID' })
  @ApiResponse({
    status: 200,
    description: 'Washing machine order retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Washing machine order not found' })
  async getOne(
    @Param('id') id: number,
    @Query('include') include?: string,
  ): Promise<ResponseResult<WashingMachineOrmEntity>> {
    return await this._service.getOne(id, include);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update washing machine order by ID' })
  @ApiParam({ name: 'id', description: 'Washing machine order ID' })
  @ApiResponse({
    status: 200,
    description: 'Washing machine order updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Washing machine order not found' })
  async update(
    @Param('id') id: number,
    @Body() body: UpdateLaundryMachineDto,
  ): Promise<ResponseResult<WashingMachineOrmEntity>> {
    return await this._service.update(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete washing machine order by ID' })
  @ApiParam({ name: 'id', description: 'Washing machine order ID' })
  @ApiResponse({
    status: 200,
    description: 'Washing machine order deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Washing machine order not found' })
  async delete(@Param('id') id: number): Promise<void> {
    return await this._service.delete(id);
  }

  // Detail endpoints
  @Post(':id/details')
  @ApiOperation({ summary: 'Add detail to washing machine order' })
  @ApiParam({ name: 'id', description: 'Washing machine order ID' })
  @ApiResponse({
    status: 201,
    description: 'Detail added successfully',
  })
  async addDetail(
    @Param('id') id: number,
    @Body() detailData: CreateWashingMachineDetailDto,
  ): Promise<ResponseResult<WashingMachineDetailOrmEntity>> {
    return await this._service.addDetail(id, detailData);
  }

  @Put('details/:detailId')
  @ApiOperation({ summary: 'Update washing machine detail' })
  @ApiParam({ name: 'detailId', description: 'Detail ID' })
  @ApiResponse({
    status: 200,
    description: 'Detail updated successfully',
  })
  async updateDetail(
    @Param('detailId') detailId: number,
    @Body() detailData: any,
  ): Promise<ResponseResult<WashingMachineDetailOrmEntity>> {
    return await this._service.updateDetail(detailId, detailData);
  }

  @Delete('details/:detailId')
  @ApiOperation({ summary: 'Remove washing machine detail' })
  @ApiParam({ name: 'detailId', description: 'Detail ID' })
  @ApiResponse({
    status: 200,
    description: 'Detail removed successfully',
  })
  async removeDetail(@Param('detailId') detailId: number): Promise<void> {
    return await this._service.removeDetail(detailId);
  }
}
