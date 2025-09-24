import { Controller, Inject } from '@nestjs/common';
import { CATEGORY_SERVICE } from '@src/common/constants/inject-key';
import { ICategoryServiceInterface } from '../interfaces/service.interface';

@Controller('categories')
export class CategoryController {
  constructor(
    @Inject(CATEGORY_SERVICE)
    private readonly _service: ICategoryServiceInterface,
  ) {}
}
