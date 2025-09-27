import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Put,
  Query,
} from '@nestjs/common';
import { ITaxServiceInterface } from '../interfaces/service.interface';
import { TAX_SERVICE } from '@src/common/constants/inject-key';
import { UpdateDto } from '../dtos/create/update.dto';
import { TaxOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/tax.orm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { TaxQueryDto } from '../dtos/query/query.dto';

@Controller('taxes')
export class TaxController {
  constructor(
    @Inject(TAX_SERVICE)
    private readonly _service: ITaxServiceInterface,
  ) {}

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateDto,
  ): Promise<ResponseResult<TaxOrmEntity>> {
    return await this._service.update(id, dto);
  }

  @Get()
  async findAll(
    @Query() query: TaxQueryDto,
  ): Promise<ResponseResult<TaxOrmEntity>> {
    return await this._service.findAll(query);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: number,
  ): Promise<ResponseResult<TaxOrmEntity>> {
    return await this._service.findOne(id);
  }
}
