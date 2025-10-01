import { Body, Controller, Inject, Post } from '@nestjs/common';
import { CATEGORY_SERVICE } from '@src/common/constants/inject-key';
import { ICategoryServiceInterface } from '../interfaces/service.interface';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { ProductCategoryOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/product-categoy.orm';
import { CreateDto } from '../dtos/create/create.dto';

@Controller('categories')
export class CategoryController {
  constructor(
    @Inject(CATEGORY_SERVICE)
    private readonly _service: ICategoryServiceInterface,
  ) {}

  @Post()
  async create(
    @Body() body: CreateDto,
  ): Promise<ResponseResult<ProductCategoryOrmEntity>> {
    return await this._service.create(body);
  }
}
