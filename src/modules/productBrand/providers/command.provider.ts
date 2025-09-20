import { Provider } from '@nestjs/common';
import { CreateHandler } from '../commands/handler/create-command.handler';
import { GetAllQueryHandler } from '../queries/handler/get-all-query.handler';
import { GetByIdQueryHandler } from '../queries/handler/get-by-id-query.handler';
import { UpdateHandler } from '../commands/handler/update-command.handler';
import { DeleteHandler } from '../commands/handler/delete-command.handler';

export const commandProviders: Provider[] = [
  CreateHandler,
  GetAllQueryHandler,
  GetByIdQueryHandler,
  UpdateHandler,
  DeleteHandler,
];
