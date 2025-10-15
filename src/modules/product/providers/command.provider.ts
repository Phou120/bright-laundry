import { Provider } from '@nestjs/common';
import { CreateProductHandler } from '../commands/handlers/create-product.handler';
import { GetAllProductsQueryHandler } from '../queries/handlers/get-all-products.handler';
import { GetProductByIdQueryHandler } from '../queries/handlers/get-product-by-id.handler';
import { UpdateProductHandler } from '../commands/handlers/update-product.handler';
import { DeleteProductHandler } from '../commands/handlers/delete-product.handler';

export const commandProviders: Provider[] = [
  CreateProductHandler,
  GetAllProductsQueryHandler,
  GetProductByIdQueryHandler,
  UpdateProductHandler,
  DeleteProductHandler,
];