import { Provider } from '@nestjs/common';
import { CreateHandler } from '../commands/handlers/create-command.handler';
import { GetAllTagQueryHandler } from '../queries/handlers/get-all-query.handler';
import { GetOneTagQueryHandler } from '../queries/handlers/get-one-query.handler';
import { UpdateHandler } from '../commands/handlers/update-command.handler';
import { DeleteHandler } from '../commands/handlers/delete-command.handler';

export const commandProviders: Provider[] = [
  CreateHandler,
  GetAllTagQueryHandler,
  GetOneTagQueryHandler,
  UpdateHandler,
  DeleteHandler,
];
