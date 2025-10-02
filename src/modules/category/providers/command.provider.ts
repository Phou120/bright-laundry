import { Provider } from '@nestjs/common';
import { CreateHandler } from '../commands/handlers/create-command.handler';
import { UpdateHandler } from '../commands/handlers/update-command.handler';
import { DeleteHandler } from '../commands/handlers/delete-command.handler';
import { GetAllQueryHandler } from '../queries/handlers/get-all-query.handler';
import { GetByIdQueryHandler } from '../queries/handlers/get-by-id-query.handler';

export const commandProviders: Provider[] = [
  CreateHandler,
  UpdateHandler,
  DeleteHandler,
  GetAllQueryHandler,
  GetByIdQueryHandler,
];
