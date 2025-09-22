import { Provider } from '@nestjs/common';
import { TagDataAccessMapper } from '../mappers/tag.mapper';

export const MapperProviders: Provider[] = [TagDataAccessMapper];
