import { Provider } from '@nestjs/common';
import { ProductDataAccessMapper } from '../mappers/product.mapper';

export const MapperProviders: Provider[] = [ProductDataAccessMapper];