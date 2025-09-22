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
import { TAG_SERVICE } from '@src/common/constants/inject-key';
import { ITagServiceInterface } from '../interfaces/service.interface';
import { CreateDto } from '../dtos/create.dto';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { TagOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/tag.orm';
import { TagQueryDto } from '../dtos/query/query.dto';
import { UpdateDto } from '../dtos/update.dto';

@Controller('tags')
export class TagController {
  constructor(
    @Inject(TAG_SERVICE)
    private readonly _service: ITagServiceInterface,
  ) {}

  @Post()
  async create(@Body() dto: CreateDto): Promise<ResponseResult<TagOrmEntity>> {
    return await this._service.create(dto);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateDto,
  ): Promise<ResponseResult<TagOrmEntity>> {
    return await this._service.update(id, dto);
  }

  @Get()
  async findAll(
    @Query() query: TagQueryDto,
  ): Promise<ResponseResult<TagOrmEntity>> {
    return await this._service.findAll(query);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: number,
  ): Promise<ResponseResult<TagOrmEntity>> {
    return await this._service.findOne(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return await this._service.delete(id);
  }
}
