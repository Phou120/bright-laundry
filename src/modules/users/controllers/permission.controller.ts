import { Controller, Get, Inject, Param, Query } from '@nestjs/common';
import { PERMISSION_SERVICE } from '@src/common/constants/inject-key';
import { UserQueryDto } from '../dtos/query/query.dto';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { PermissionGroupOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/permission-group.orm';
import { IReadPermissionRepository } from '../interfaces/permission.interface';

@Controller('permissions')
export class PermissionController {
  constructor(
    @Inject(PERMISSION_SERVICE)
    private readonly _service: IReadPermissionRepository,
  ) {}

  @Get()
  async getAll(
    @Query() query: UserQueryDto,
  ): Promise<ResponseResult<PermissionGroupOrmEntity>> {
    return await this._service.findAll(query);
  }

  @Get(':id')
  async getOne(
    @Param('id') id: number,
  ): Promise<ResponseResult<PermissionGroupOrmEntity>> {
    return await this._service.getOne(id);
  }
}
