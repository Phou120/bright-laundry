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
import { STORE_USER_SERVICE } from '@src/common/constants/inject-key';
import { IStoreUserServiceInterface } from '../interfaces/service.interface';
import { User } from '@src/common/decorator/user.decorator';
import { CreateStoreUserDto } from '../dtos/create/create.dto';
import { StoreUserOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/store-user.orm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { StoreUserQueryDto } from '../dtos/query/query.dto';
import { UpdateDto } from '../dtos/create/update.dto';

@Controller('store-users')
export class StoreUserController {
  constructor(
    @Inject(STORE_USER_SERVICE)
    private readonly _service: IStoreUserServiceInterface,
  ) {}

  @Post()
  async create(
    @User('id') userId: number,
    @Body() dto: CreateStoreUserDto,
  ): Promise<ResponseResult<StoreUserOrmEntity>> {
    return await this._service.create(userId, dto);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateDto,
  ): Promise<ResponseResult<StoreUserOrmEntity>> {
    return await this._service.update(id, dto);
  }

  @Get()
  async getAll(
    @User('id') userId: number,
    @Query() query: StoreUserQueryDto,
  ): Promise<ResponseResult<StoreUserOrmEntity>> {
    return await this._service.getAll(userId, query);
  }

  @Get(':id')
  async getById(
    @User('id') userId: number,
    @Param('id') id: number,
  ): Promise<ResponseResult<StoreUserOrmEntity>> {
    return await this._service.getById(userId, id);
  }

  @Delete(':id')
  async delete(
    @User('id') userId: number,
    @Param('id') id: number,
  ): Promise<ResponseResult<void>> {
    return await this._service.delete(userId, id);
  }
}
