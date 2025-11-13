import { Injectable, Inject } from '@nestjs/common';
import { IBannerServiceInterface } from '../interfaces/service.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { BannerOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/banner.orm';
import { Repository } from 'typeorm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { CreateBannerDto } from '../dtos/create.dto';
import { BannerQueryDto } from '../dtos/query/query.dto';
import { UpdateBannerDto } from '../dtos/update.dto';
import { EntityManager } from 'typeorm';
import { AMAZON_S3_SERVICE_KEY } from '@src/common/infrastructure/aws3/config/inject-key';
import { IAmazonS3ImageService } from '@src/common/infrastructure/aws3/interface/amazon-s3-image-service.interface';
import { optimizeImage } from '@src/common/utils/image-optimize.util';

@Injectable()
export class BannerService implements IBannerServiceInterface {
  constructor(
    @InjectRepository(BannerOrmEntity)
    private readonly bannerRepository: Repository<BannerOrmEntity>,
    @Inject(AMAZON_S3_SERVICE_KEY)
    private readonly amazonS3ServiceKey: IAmazonS3ImageService,
  ) {}

  async create(
    body: CreateBannerDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<BannerOrmEntity>> {
    const repository = manager
      ? manager.getRepository(BannerOrmEntity)
      : this.bannerRepository;

    const banner = repository.create(body);
    const savedBanner = await repository.save(banner);

    return savedBanner;
  }

  async getAll(
    query: BannerQueryDto,
  ): Promise<ResponseResult<BannerOrmEntity>> {
    const {
      page = 1,
      limit = 10,
      search,
      sort_by = 'created_at',
      sort_order = 'DESC',
    } = query;

    const queryBuilder = this.bannerRepository
      .createQueryBuilder('banner')
      .where('banner.deleted_at IS NULL');

    if (search) {
      queryBuilder.andWhere(
        '(banner.file_banner ILIKE :search OR banner.link ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (query.file_banner) {
      queryBuilder.andWhere('banner.file_banner ILIKE :file_banner', {
        file_banner: `%${query.file_banner}%`,
      });
    }

    if (query.link) {
      queryBuilder.andWhere('banner.link ILIKE :link', {
        link: `%${query.link}%`,
      });
    }

    if (query.order_by) {
      queryBuilder.andWhere('banner.order_by ILIKE :order_by', {
        order_by: `%${query.order_by}%`,
      });
    }

    queryBuilder
      .orderBy(`banner.${sort_by}`, sort_order)
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    const mappedData = data.map((banner) => {
      // Check if the user has a profile and an image filename
      if (banner.file_banner) {
        const data = {
          ...banner,
          image_url: this.amazonS3ServiceKey.getCloudFrontImageUrl(
            banner?.file_banner ?? '',
          ),
        };

        return data;
      }

      return banner;
    });

    return {
      data: mappedData,
      pagination: {
        total,
        total_pages: Math.ceil(total / limit),
        page,
        limit,
      },
    };
  }

  async getOne(id: number): Promise<ResponseResult<BannerOrmEntity>> {
    const banner = await this.bannerRepository.findOne({
      where: { id },
    });

    if (!banner) {
      throw new Error('Banner not found');
    }

    const data = {
      ...banner,
      image_url: this.amazonS3ServiceKey.getCloudFrontImageUrl(
        banner?.file_banner ?? '',
      ),
    };

    return data;
  }

  async update(
    id: number,
    body: UpdateBannerDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<BannerOrmEntity>> {
    const repository = manager
      ? manager.getRepository(BannerOrmEntity)
      : this.bannerRepository;

    const banner = await repository.findOne({
      where: { id },
    });

    if (!banner) {
      throw new Error('Banner not found');
    }

    Object.assign(banner, body);
    const updatedBanner = await repository.save(banner);

    return updatedBanner;
  }

  async delete(id: number, manager?: EntityManager): Promise<void> {
    const repository = manager
      ? manager.getRepository(BannerOrmEntity)
      : this.bannerRepository;

    const banner = await repository.findOne({
      where: { id },
    });

    if (!banner) {
      throw new Error('Banner not found');
    }

    await repository.softDelete(id);
  }

  async uploadFile(
    file: Express.Multer.File,
    manager?: EntityManager,
  ): Promise<{ imageUrl: string }> {
    let fileKey: string | null = null;
    if (file) {
      const optimizedImage = await optimizeImage(file);
      const uploadResult =
        await this.amazonS3ServiceKey.uploadFile(optimizedImage);
      fileKey = uploadResult.fileKey;
      return {
        // imageUrl: fileKey,
        imageUrl: this.amazonS3ServiceKey.getCloudFrontImageUrl(fileKey),
      };
    }
    throw new Error('No file provided');
  }
}
