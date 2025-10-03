import { Provider } from '@nestjs/common';
import { GetAllDistrictHandler } from '../queries/handlers/get-all.handler';
import { GetByIdDistrictHandler } from '../queries/handlers/get-by-id.handler';

export const commandProviders: Provider[] = [
  GetAllDistrictHandler,
  GetByIdDistrictHandler,
];
