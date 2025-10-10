import { Provider } from '@nestjs/common';
import { ProductAttributeDataAccessMapper } from '../mappers/product-attribute.mapper';

export const MapperProviders: Provider[] = [ProductAttributeDataAccessMapper];
