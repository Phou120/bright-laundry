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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiConsumes,
} from '@nestjs/swagger';
import {
  IMAGE_ALLOW_MIME_TYPE,
  MAX_IMAGE_SIZE,
  STORE_SERVICE,
} from '@src/common/constants/inject-key';
import { IStoreServiceInterface } from '../interfaces/service.interface';
import { StoreOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/store.orm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { CreateStoreDto } from '../dtos/create.dto';
import { StoreQueryDto } from '../dtos/query/query.dto';
import { UpdateStoreDto } from '../dtos/update.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerMemoryStorage } from '@src/common/utils/multer.utils';
import { FileValidationInterceptor } from '@src/common/interceptors/file/file.interceptor';
import { FileMimeTypeValidator } from '@src/common/validations/file-mime-type.validator';
import { FileSizeValidator } from '@src/common/validations/file-size.validator';

@ApiTags('stores')
@Controller('stores')
export class StoreController {
  constructor(
    @Inject(STORE_SERVICE)
    private readonly _service: IStoreServiceInterface,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new store' })
  @ApiResponse({ status: 201, description: 'Store created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(
    @Body() body: CreateStoreDto,
  ): Promise<ResponseResult<StoreOrmEntity>> {
    return await this._service.create(body);
  }

  @Post('with-user')
  @ApiOperation({ summary: 'Create a new store with associated user' })
  @ApiResponse({
    status: 201,
    description: 'Store and user created successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async createWithUser(
    @Body() body: CreateStoreDto,
  ): Promise<{ store: StoreOrmEntity; user: any; storeUser: any }> {
    return await this._service.createWithUser(body);
  }

  @Post('upload-store-logo')
  @ApiOperation({ summary: 'Upload store logo' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Logo uploaded successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
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
  @ApiOperation({ summary: 'Get all stores with pagination' })
  @ApiResponse({ status: 200, description: 'Stores retrieved successfully' })
  async getAll(
    @Query() query: StoreQueryDto,
  ): Promise<ResponseResult<StoreOrmEntity>> {
    return await this._service.getAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get store by ID' })
  @ApiParam({ name: 'id', description: 'Store ID' })
  @ApiResponse({ status: 200, description: 'Store retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Store not found' })
  async getOne(
    @Param('id') id: number,
  ): Promise<ResponseResult<StoreOrmEntity>> {
    return await this._service.getOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update store by ID' })
  @ApiParam({ name: 'id', description: 'Store ID' })
  @ApiResponse({ status: 200, description: 'Store updated successfully' })
  @ApiResponse({ status: 404, description: 'Store not found' })
  async update(
    @Param('id') id: number,
    @Body() body: UpdateStoreDto,
  ): Promise<ResponseResult<StoreOrmEntity>> {
    return await this._service.update(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete store by ID' })
  @ApiParam({ name: 'id', description: 'Store ID' })
  @ApiResponse({ status: 200, description: 'Store deleted successfully' })
  @ApiResponse({ status: 404, description: 'Store not found' })
  async delete(@Param('id') id: number): Promise<void> {
    return await this._service.delete(id);
  }
}
