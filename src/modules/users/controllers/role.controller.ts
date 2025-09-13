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
import { USER_SERVICE } from '@src/common/constants/inject-key';
import { RoleOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/role.orm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { CreateRoleDto } from '../dtos/create-role.dto';
import { IUserServiceInterface } from '../interfaces/service.interface';
import { UserQueryDto } from '../dtos/query/query.dto';
import { UpdateRoleDto } from '../dtos/update-role.dto';

@Controller('roles')
export class RoleController {
  constructor(
    @Inject(USER_SERVICE)
    private readonly _service: IUserServiceInterface,
  ) {}

  @Post()
  async create(
    @Body() body: CreateRoleDto,
  ): Promise<ResponseResult<RoleOrmEntity>> {
    return await this._service.createRole(body);
  }

  @Put('/:id')
  async update(
    @Param('id') id: number,
    @Body() body: UpdateRoleDto,
  ): Promise<ResponseResult<RoleOrmEntity>> {
    return await this._service.updateRole(id, body);
  }

  @Get()
  async getAll(
    @Query() query: UserQueryDto,
  ): Promise<ResponseResult<RoleOrmEntity>> {
    return await this._service.getAllRole(query);
  }

  @Get('/:id')
  async getOne(
    @Param('id') id: number,
  ): Promise<ResponseResult<RoleOrmEntity>> {
    return await this._service.getOneRole(id);
  }

  @Delete('/:id')
  async delete(@Param('id') id: number): Promise<void> {
    return await this._service.deleteRole(id);
  }
}
