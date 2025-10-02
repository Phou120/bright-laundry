import { Provider } from '@nestjs/common';
import { GetAllProvinceQueryHandler } from '../queries/handlers/get-all-query.handler';
import { GetByIdProvinceQueryHandler } from '../queries/handlers/get-by-id-qurey.handler';

export const commandProviders: Provider[] = [
  GetAllProvinceQueryHandler,
  GetByIdProvinceQueryHandler,
];
