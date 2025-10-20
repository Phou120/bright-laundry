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
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiConsumes,
} from '@nestjs/swagger';
import {
  IMAGE_ALLOW_MIME_TYPE,
  MAX_IMAGE_SIZE,
  BANNER_SERVICE,
} from '@src/common/constants/inject-key';
import { IBannerServiceInterface } from '../interfaces/service.interface';
import { BannerOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/banner.orm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { CreateBannerDto } from '../dtos/create.dto';
import { BannerQueryDto } from '../dtos/query/query.dto';
import { UpdateBannerDto } from '../dtos/update.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerMemoryStorage } from '@src/common/utils/multer.utils';
import { FileValidationInterceptor } from '@src/common/interceptors/file/file.interceptor';
import { FileMimeTypeValidator } from '@src/common/validations/file-mime-type.validator';
import { FileSizeValidator } from '@src/common/validations/file-size.validator';

@Controller('banners')
export class BannerController {
  constructor(
    @Inject(BANNER_SERVICE)
    private readonly _service: IBannerServiceInterface,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new banner' })
  @ApiResponse({ status: 201, description: 'Banner created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(
    @Body() body: CreateBannerDto,
  ): Promise<ResponseResult<BannerOrmEntity>> {
    return await this._service.create(body);
  }

  @Post('upload-banner-image')
  @ApiOperation({ summary: 'Upload banner image' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Image uploaded successfully' })
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
  async uploadBannerImage(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ imageUrl: string }> {
    return await this._service.uploadFile(file);
  }

  @Get()
  @ApiOperation({ summary: 'Get all banners with pagination' })
  @ApiResponse({ status: 200, description: 'Banners retrieved successfully' })
  async getAll(
    @Query() query: BannerQueryDto,
  ): Promise<ResponseResult<BannerOrmEntity>> {
    return await this._service.getAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get banner by ID' })
  @ApiParam({ name: 'id', description: 'Banner ID' })
  @ApiResponse({ status: 200, description: 'Banner retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Banner not found' })
  async getOne(
    @Param('id') id: number,
  ): Promise<ResponseResult<BannerOrmEntity>> {
    return await this._service.getOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update banner by ID' })
  @ApiParam({ name: 'id', description: 'Banner ID' })
  @ApiResponse({ status: 200, description: 'Banner updated successfully' })
  @ApiResponse({ status: 404, description: 'Banner not found' })
  async update(
    @Param('id') id: number,
    @Body() body: UpdateBannerDto,
  ): Promise<ResponseResult<BannerOrmEntity>> {
    return await this._service.update(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete banner by ID' })
  @ApiParam({ name: 'id', description: 'Banner ID' })
  @ApiResponse({ status: 200, description: 'Banner deleted successfully' })
  @ApiResponse({ status: 404, description: 'Banner not found' })
  async delete(@Param('id') id: number): Promise<void> {
    return await this._service.delete(id);
  }
}
