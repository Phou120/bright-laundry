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
import { STORE_SERVICE } from '@src/common/constants/inject-key';
import { IStoreServiceInterface } from '../interfaces/service.interface';
import { CreateDto } from '../dtos/create/create.dto';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { StoreOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/store.orm';
import { StoreQueryDto } from '../dtos/query/query.dto';
import { UpdateDto } from '../dtos/create/update.dto';

@Controller('stores')
export class StoreController {
  constructor(
    @Inject(STORE_SERVICE)
    private readonly _service: IStoreServiceInterface,
  ) {}

  @Post()
  async create(
    @Body() dto: CreateDto,
  ): Promise<ResponseResult<StoreOrmEntity>> {
    return await this._service.create(dto);
  }

  @Get()
  async getAll(
    @Query() query: StoreQueryDto,
  ): Promise<ResponseResult<StoreOrmEntity>> {
    return await this._service.getAll(query);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateDto,
  ): Promise<ResponseResult<StoreOrmEntity>> {
    return await this._service.update(id, dto);
  }

  @Get(':id')
  async getById(
    @Param('id') id: number,
  ): Promise<ResponseResult<StoreOrmEntity>> {
    return await this._service.getById(id);
  }

  @Delete(':id')
  async delete(
    @Param('id') id: number,
  ): Promise<ResponseResult<StoreOrmEntity>> {
    return await this._service.delete(id);
  }
}
