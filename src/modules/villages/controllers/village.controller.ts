import { Controller, Get, Inject, Param, Query } from '@nestjs/common';
import { IVillageServiceInterface } from '../interfaces/service.interface';
import { VILLAGE_SERVICE } from '@src/common/constants/inject-key';
import { VillageQueryDto } from '../dtos/query/query.dto';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { VillageOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/village.orm';

@Controller('villages')
export class VillageController {
  constructor(
    @Inject(VILLAGE_SERVICE)
    private readonly _service: IVillageServiceInterface,
  ) {}

  @Get()
  async findAll(
    @Query() query: VillageQueryDto,
  ): Promise<ResponseResult<VillageOrmEntity>> {
    return await this._service.getAll(query);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: number,
  ): Promise<ResponseResult<VillageOrmEntity>> {
    return await this._service.getOne(id);
  }
}
