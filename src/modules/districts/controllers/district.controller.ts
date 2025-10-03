import { Controller, Get, Inject, Param, Query } from '@nestjs/common';
import { IDistrictServiceInterface } from '../interfaces/service.interface';
import { DISTRICT_SERVICE } from '@src/common/constants/inject-key';
import { DistrictQueryDto } from '../dtos/query/query.dto';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { DistrictOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/district.orm';

@Controller('districts')
export class DistrictController {
  constructor(
    @Inject(DISTRICT_SERVICE)
    private readonly _service: IDistrictServiceInterface,
  ) {}

  @Get()
  async findAll(
    @Query() query: DistrictQueryDto,
  ): Promise<ResponseResult<DistrictOrmEntity>> {
    return await this._service.getAll(query);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: number,
  ): Promise<ResponseResult<DistrictOrmEntity>> {
    return await this._service.getOne(id);
  }
}
