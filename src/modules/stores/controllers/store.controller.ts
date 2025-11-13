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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  IMAGE_ALLOW_MIME_TYPE,
  MAX_IMAGE_SIZE,
  STORE_SERVICE,
} from '@src/common/constants/inject-key';
import { IStoreServiceInterface } from '../interfaces/service.interface';
import { StoreOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/store.orm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { CreateStoreAndUserDto, CreateUserStoreDto } from '../dtos/create.dto';
import { StoreQueryDto } from '../dtos/query/query.dto';
import { UpdateStoreDto } from '../dtos/update.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerMemoryStorage } from '@src/common/utils/multer.utils';
import { FileValidationInterceptor } from '@src/common/interceptors/file/file.interceptor';
import { FileMimeTypeValidator } from '@src/common/validations/file-mime-type.validator';
import { FileSizeValidator } from '@src/common/validations/file-size.validator';
import { User } from '@src/common/decorator/user.decorator';
import { UserOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/user.orm';

@ApiTags('stores')
@Controller('stores')
export class StoreController {
  constructor(
    @Inject(STORE_SERVICE)
    private readonly _service: IStoreServiceInterface,
  ) {}

  @Post()
  async create(
    @Body() body: CreateStoreAndUserDto,
  ): Promise<ResponseResult<StoreOrmEntity>> {
    return await this._service.create(body);
  }

  @Post('user')
  async createWithUser(
    @User('id') userId: number,
    @Body() body: CreateUserStoreDto,
  ): Promise<ResponseResult<UserOrmEntity>> {
    return await this._service.createWithUser(userId, body);
  }

  @Post('upload-store-logo')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: multerMemoryStorage,
    }),
    new FileValidationInterceptor(
      new FileMimeTypeValidator(IMAGE_ALLOW_MIME_TYPE),
      new FileSizeValidator(MAX_IMAGE_SIZE),
      'image',
    ),
  )
  async uploadStoreLogo(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ imageUrl: string }> {
    return await this._service.uploadStoreLogo(file);
  }

  @Get()
  async getAll(
    @Query() query: StoreQueryDto,
  ): Promise<ResponseResult<StoreOrmEntity>> {
    return await this._service.getAll(query);
  }

  @Get('user')
  async getAllUser(
    @User('id') userId: number,
    @Query() query: StoreQueryDto,
  ): Promise<ResponseResult<UserOrmEntity>> {
    return await this._service.getAllUser(userId, query);
  }

  @Get(':id')
  async getOne(
    @Param('id') id: number,
  ): Promise<ResponseResult<StoreOrmEntity>> {
    return await this._service.getOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() body: UpdateStoreDto,
  ): Promise<ResponseResult<StoreOrmEntity>> {
    return await this._service.update(id, body);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return await this._service.delete(id);
  }

  @Delete('user/:id')
  async deleteUser(@Param('id') id: number): Promise<void> {
    return await this._service.deleteUser(id);
  }
}
