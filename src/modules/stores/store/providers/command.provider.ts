import { Provider } from '@nestjs/common';
import { CreateHandler } from '../commands/handlers/create-command.handler';
import { GetAllStoreQueryHandler } from '../queries/handlers/get-all-query.handler';
import { GetByIdStoreQueryHandler } from '../queries/handlers/get-by-id-query.handler';
import { UpdateCommandHandler } from '../commands/handlers/update-command.handler';
import { DeleteHandler } from '../commands/handlers/delete-command.handler';

export const commandProviders: Provider[] = [
  CreateHandler,
  GetAllStoreQueryHandler,
  GetByIdStoreQueryHandler,
  UpdateCommandHandler,
  DeleteHandler,
];
