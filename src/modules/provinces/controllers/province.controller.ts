import { Controller, Get, Inject, Param, Query } from '@nestjs/common';
import { IProvinceServiceInterface } from '../interfaces/service.interface';
import { PROVINCE_SERVICE } from '@src/common/constants/inject-key';
import { ProvinceQueryDto } from '../dtos/query/query.dto';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { ProvinceOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/province.orm';

@Controller('provinces')
export class ProvinceController {
  constructor(
    @Inject(PROVINCE_SERVICE)
    private readonly _service: IProvinceServiceInterface,
  ) {}

  @Get()
  async findAll(
    @Query() query: ProvinceQueryDto,
  ): Promise<ResponseResult<ProvinceOrmEntity>> {
    return await this._service.getAll(query);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: number,
  ): Promise<ResponseResult<ProvinceOrmEntity>> {
    return await this._service.getOne(id);
  }
}
