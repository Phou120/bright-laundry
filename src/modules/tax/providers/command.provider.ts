import { Provider } from '@nestjs/common';
import { UpdateHandler } from '../commands/handlers/update-command.handler';
import { GetAllTaxQueryHandler } from '../queries/handlers/get-all-query.handler';
import { GetByIdQueryHandler } from '../queries/handlers/get-by-id-query.handler';

export const commandProviders: Provider[] = [
  UpdateHandler,
  GetAllTaxQueryHandler,
  GetByIdQueryHandler,
];
