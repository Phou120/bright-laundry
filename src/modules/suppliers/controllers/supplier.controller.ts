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
import { SUPPLIER_SERVICE } from '@src/common/constants/inject-key';
import { CreateDto } from '../dtos/create.dto';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { SupplierOrmEntity } from '../../../common/infrastructure/database/typeorms/entities/supplier.orm';
import { ISupplierServiceInterface } from '../interfaces/service.interface';
import { User } from '@src/common/decorator/user.decorator';
import { SupplierQueryDto } from '../dtos/query/query.dto';
import { UpdateDto } from '../dtos/update.dto';

@Controller('suppliers')
export class SupplierController {
  constructor(
    @Inject(SUPPLIER_SERVICE)
    private readonly _service: ISupplierServiceInterface,
  ) {}

  @Post()
  async create(
    @User('id') user_id: number,
    @Body() dto: CreateDto,
  ): Promise<ResponseResult<SupplierOrmEntity>> {
    return await this._service.create(dto, user_id);
  }

  @Put('/:id')
  async update(
    @User('id') user_id: number,
    @Param('id') id: number,
    @Body() dto: UpdateDto,
  ): Promise<ResponseResult<SupplierOrmEntity>> {
    return await this._service.update(id, dto, user_id);
  }

  @Get()
  async findAll(
    @Query() query: SupplierQueryDto,
  ): Promise<ResponseResult<SupplierOrmEntity>> {
    return await this._service.findAll(query);
  }

  @Get('/:id')
  async findById(
    @Param('id') id: number,
  ): Promise<ResponseResult<SupplierOrmEntity>> {
    return await this._service.findById(id);
  }

  @Delete('/:id')
  async delete(@Param('id') id: number): Promise<void> {
    return await this._service.delete(id);
  }
}
