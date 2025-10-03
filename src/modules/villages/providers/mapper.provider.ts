import { Provider } from '@nestjs/common';
import { VillageDataAccessMapper } from '../mappers/village.mapper';

export const MapperProviders: Provider[] = [VillageDataAccessMapper];
