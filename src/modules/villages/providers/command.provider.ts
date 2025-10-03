import { Provider } from '@nestjs/common';
import { GetAllVillageHandler } from '../queries/handlers/get-all.handler';
import { GetByIdVillageHandler } from '../queries/handlers/get-by-id.handler';

export const commandProviders: Provider[] = [
  GetAllVillageHandler,
  GetByIdVillageHandler,
];
