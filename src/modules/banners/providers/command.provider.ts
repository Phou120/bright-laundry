import { Provider } from '@nestjs/common';
import { CreateHandler } from '../commands/handlers/create-command.handler';
import { GetAllBannerQueryHandler } from '../queries/handlers/get-all-query.handler';
import { GetByIdBannerQueryHandler } from '../queries/handlers/get-by-id-query.handler';
import { UpdateHandler } from '../commands/handlers/update-command.handler';
import { DeleteHandler } from '../commands/handlers/delete-command.handler';
import { UpdateOrderHandler } from '../commands/handlers/update-order-command.handler';

export const commandProviders: Provider[] = [
  CreateHandler,
  GetAllBannerQueryHandler,
  GetByIdBannerQueryHandler,
  UpdateHandler,
  DeleteHandler,
  UpdateOrderHandler,
];
