import { Provider } from '@nestjs/common';
import { CreateHandler } from '../commands/handler/create-command.handler';
import { GetAllQueryHandler } from '../queries/handler/get-all-query.handler';
import { GetByIdQueryHandler } from '../queries/handler/get-by-id-query.handler';

export const commandProviders: Provider[] = [
  CreateHandler,
  GetAllQueryHandler,
  GetByIdQueryHandler,
];
