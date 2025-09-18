import { Controller, Inject } from '@nestjs/common';
import { BRAND_SERVICE } from '@src/common/constants/inject-key';
import { IBrandServiceInterface } from '../interfaces/service.interface';

@Controller('brands')
export class BrandController {
  constructor(
    @Inject(BRAND_SERVICE)
    private readonly _service: IBrandServiceInterface,
  ) {}
}
