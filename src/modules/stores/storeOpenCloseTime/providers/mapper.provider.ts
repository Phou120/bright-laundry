import { Provider } from '@nestjs/common';
import { StoreOpenCloseTimeDataAccessMapper } from '../mappers/store-open-close-time.mapper';

export const MapperProviders: Provider[] = [StoreOpenCloseTimeDataAccessMapper];
