import { Provider } from '@nestjs/common';
import { CreateHandler } from '../commands/handlers/create-command.handler';
import { GetAllStoreUserQueryHandler } from '../queries/handlers/get-all-query.handler';
import { GetByIdStoreUserQueryHandler } from '../queries/handlers/get-by-id-query.handler';
import { UpdateHandler } from '../commands/handlers/update-command.handler';
import { DeleteHandler } from '../commands/handlers/delete-command.handler';
import { CreateAdminHandler } from '../commands/handlers/admin-create-command.handler';

export const commandProviders: Provider[] = [
  CreateHandler,
  GetAllStoreUserQueryHandler,
  GetByIdStoreUserQueryHandler,
  UpdateHandler,
  DeleteHandler,
  CreateAdminHandler,
];
