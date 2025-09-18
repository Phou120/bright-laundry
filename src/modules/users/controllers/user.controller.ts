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
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import {
  IMAGE_ALLOW_MIME_TYPE,
  MAX_IMAGE_SIZE,
  USER_SERVICE,
} from '@src/common/constants/inject-key';
import { IUserServiceInterface } from '../interfaces/service.interface';
import { UserOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/user.orm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { CreateDto } from '../dtos/create.dto';
import { UserQueryDto } from '../dtos/query/query.dto';
import { UpdateDto } from '../dtos/update.dto';
import { Public } from '@src/common/decorator/auth.decorator';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { multerMemoryStorage } from '@src/common/utils/multer.utils';
import { FileValidationInterceptor } from '@src/common/interceptors/file/file.interceptor';
import { FileMimeTypeValidator } from '@src/common/validations/file-mime-type.validator';
import { FileSizeValidator } from '@src/common/validations/file-size.validator';
import { UploadDto } from '../dtos/upload.dto';
import { UploadMultipleDto } from '../dtos/upload-multiple.dto';
import { SendMailDto } from '../dtos/send-mail.dto';
import { VerifyOtpDto } from '../dtos/verify-otp.dto';
import { ResetPasswordDto } from '../dtos/reset-password.dto';

@Controller('users')
export class UserController {
  constructor(
    @Inject(USER_SERVICE)
    private readonly _service: IUserServiceInterface,
  ) {}

  @Public()
  @Post('upload-single-file')
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
  async upload(
    @Body() body: UploadDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ imageUrl: string }> {
    return await this._service.uploadFile(file);
  }

  @Public()
  @Post('upload-multiple-files')
  @UseInterceptors(
    AnyFilesInterceptor({ storage: multerMemoryStorage }),
    new FileValidationInterceptor(
      new FileMimeTypeValidator(IMAGE_ALLOW_MIME_TYPE),
      new FileSizeValidator(MAX_IMAGE_SIZE),
      'images',
    ),
  )
  async uploadMultipleFile(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: UploadMultipleDto,
  ): Promise<{ imageUrls: string[] }> {
    console.log('file', body);
    return await this._service.uploadFiles(files);
  }

  @Public()
  @Post()
  async create(
    @Body() body: CreateDto,
  ): Promise<ResponseResult<UserOrmEntity>> {
    return await this._service.create(body);
  }

  @Put('/:id')
  async update(
    @Param('id') id: number,
    @Body() body: UpdateDto,
  ): Promise<ResponseResult<UserOrmEntity>> {
    return await this._service.update(id, body);
  }

  @Post('send-mail')
  async sendMail(@Body() body: SendMailDto): Promise<void> {
    return await this._service.sendMail(body);
  }

  @Post('verify-otp')
  async verifyOtp(
    @Body() body: VerifyOtpDto,
  ): Promise<ResponseResult<UserOrmEntity>> {
    return await this._service.verifyOtp(body);
  }

  @Put('reset-password/:id')
  async resetPassword(
    @Param('id') id: number,
    @Body() body: ResetPasswordDto,
  ): Promise<ResponseResult<UserOrmEntity>> {
    return await this._service.resetPassword(id, body);
  }

  @Get()
  async getAll(
    @Query() query: UserQueryDto,
  ): Promise<ResponseResult<UserOrmEntity>> {
    return await this._service.getAll(query);
  }

  @Get('/:id')
  async getOne(
    @Param('id') id: number,
  ): Promise<ResponseResult<UserOrmEntity>> {
    return await this._service.getOne(id);
  }

  @Delete('/:id')
  async delete(@Param('id') id: number): Promise<void> {
    return await this._service.delete(id);
  }
}
