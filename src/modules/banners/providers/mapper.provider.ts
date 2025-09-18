import { Provider } from '@nestjs/common';
import { BannerDataAccessMapper } from '../mappers/banner.mapper';

export const BannerMapperProviders: Provider[] = [BannerDataAccessMapper];
