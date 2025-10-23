import { Injectable, Inject } from '@nestjs/common';
import { IStoreServiceInterface } from '../interfaces/service.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { StoreOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/store.orm';
import { UserOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/user.orm';
import { StoreUserOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/store-user.orm';
import { Repository, EntityManager } from 'typeorm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { CreateStoreDto } from '../dtos/create.dto';
import { StoreQueryDto } from '../dtos/query/query.dto';
import { UpdateStoreDto } from '../dtos/update.dto';
import { AMAZON_S3_SERVICE_KEY } from '@src/common/infrastructure/aws3/config/inject-key';
import { IAmazonS3ImageService } from '@src/common/infrastructure/aws3/interface/amazon-s3-image-service.interface';
import { optimizeImage } from '@src/common/utils/image-optimize.util';
import { hashPassword } from '@src/common/utils/hash-password';
import { generateUniqueNo } from '@src/common/utils/generate-code.util';
import {
  E_COMMERCE,
  MAX_GENERATE_CODE_LENGTH,
} from '@src/common/constants/inject-key';
import { RoleOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/role.orm';

@Injectable()
export class StoreService implements IStoreServiceInterface {
  constructor(
    @InjectRepository(StoreOrmEntity)
    private readonly storeRepository: Repository<StoreOrmEntity>,
    @InjectRepository(UserOrmEntity)
    private readonly userRepository: Repository<UserOrmEntity>,
    @InjectRepository(StoreUserOrmEntity)
    private readonly storeUserRepository: Repository<StoreUserOrmEntity>,
    @InjectRepository(RoleOrmEntity)
    private readonly roleRepository: Repository<RoleOrmEntity>,
    @Inject(AMAZON_S3_SERVICE_KEY)
    private readonly amazonS3ServiceKey: IAmazonS3ImageService,
  ) {}

  async create(
    body: CreateStoreDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<StoreOrmEntity>> {
    const storeManager = manager ? manager : this.storeRepository.manager;

    // Generate unique store number
    const store_no = await this.generateUniqueStoreNo(storeManager);

    const storeData = {
      ...body,
      store_no,
    };

    const store = storeManager.getRepository(StoreOrmEntity).create(storeData);
    const savedStore = await storeManager
      .getRepository(StoreOrmEntity)
      .save(store);

    return savedStore;
  }

  async createWithUser(
    body: CreateStoreDto,
    manager?: EntityManager,
  ): Promise<{
    store: StoreOrmEntity;
    user: UserOrmEntity | null;
    storeUser: StoreUserOrmEntity | null;
  }> {
    const storeManager = manager ? manager : this.storeRepository.manager;

    return await storeManager.transaction(async (transactionManager) => {
      // 1. Create the store
      const store_no = await this.generateUniqueStoreNo(transactionManager);

      const storeData = {
        ...body,
        store_no,
        // user?: body.user,
      };
      // if (storeData.user) {
      //   delete storeData.user?.;
      // } // Remove user data from store creation

      const store = transactionManager
        .getRepository(StoreOrmEntity)
        .create(storeData);
      const savedStore = await transactionManager
        .getRepository(StoreOrmEntity)
        .save(store);

      if (body.user) {
        // 2. Create the user
        const user_no =
          await this.generateUniqueCustomerCode(transactionManager);
        const hashedPassword = await hashPassword(body.user.password);

        // Get default role (you might want to make this configurable)
        const defaultRole = await transactionManager
          .getRepository(RoleOrmEntity)
          .findOne({
            where: { name: 'user' }, // Adjust based on your role system
          });

        const userData = {
          user_no,
          name: body.user.name,
          surname: body.user.surname,
          email: body.user.email,
          password: hashedPassword,
          tel: body.user.tel,
        };

        const user = transactionManager
          .getRepository(UserOrmEntity)
          .create(userData);
        const savedUser = await transactionManager
          .getRepository(UserOrmEntity)
          .save(user);

        // 3. Create the store-user relationship
        const storeUserData = {
          store_id: savedStore.id,
          user_id: savedUser.id,
        };

        const storeUser = transactionManager
          .getRepository(StoreUserOrmEntity)
          .create(storeUserData);
        const savedStoreUser = await transactionManager
          .getRepository(StoreUserOrmEntity)
          .save(storeUser);

        return {
          store: savedStore,
          user: savedUser,
          storeUser: savedStoreUser,
        };
      }

      return {
        store: savedStore,
        user: null,
        storeUser: null,
      };
    });
  }

  async getAll(query: StoreQueryDto): Promise<ResponseResult<StoreOrmEntity>> {
    const {
      page = 1,
      limit = 10,
      search,
      sort_by = 'created_at',
      sort_order = 'DESC',
    } = query;

    const queryBuilder = this.storeRepository
      .createQueryBuilder('store')
      .leftJoinAndSelect('store.store_status', 'store_status')
      .leftJoinAndSelect('store.tax', 'tax')
      .where('store.deleted_at IS NULL');

    if (search) {
      queryBuilder.andWhere(
        '(store.name ILIKE :search OR store.email ILIKE :search OR store.tel ILIKE :search OR store.address ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (query.name) {
      queryBuilder.andWhere('store.name ILIKE :name', {
        name: `%${query.name}%`,
      });
    }

    if (query.email) {
      queryBuilder.andWhere('store.email ILIKE :email', {
        email: `%${query.email}%`,
      });
    }

    if (query.tel) {
      queryBuilder.andWhere('store.tel ILIKE :tel', {
        tel: `%${query.tel}%`,
      });
    }

    if (query.address) {
      queryBuilder.andWhere('store.address ILIKE :address', {
        address: `%${query.address}%`,
      });
    }

    if (query.store_status_id) {
      queryBuilder.andWhere('store.store_status_id = :store_status_id', {
        store_status_id: query.store_status_id,
      });
    }

    if (query.tax_id) {
      queryBuilder.andWhere('store.tax_id = :tax_id', {
        tax_id: query.tax_id,
      });
    }

    queryBuilder
      .orderBy(`store.${sort_by}`, sort_order)
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      pagination: {
        total,
        total_pages: Math.ceil(total / limit),
        page,
        limit,
      },
    };
  }

  async getOne(id: number): Promise<ResponseResult<StoreOrmEntity>> {
    const store = await this.storeRepository.findOne({
      where: { id },
      relations: ['store_status', 'tax', 'store_users', 'store_users.user'],
    });

    if (!store) {
      throw new Error('Store not found');
    }

    return store;
  }

  async update(
    id: number,
    body: UpdateStoreDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<StoreOrmEntity>> {
    const repository = manager
      ? manager.getRepository(StoreOrmEntity)
      : this.storeRepository;

    const store = await repository.findOne({
      where: { id },
    });

    if (!store) {
      throw new Error('Store not found');
    }

    Object.assign(store, body);
    const updatedStore = await repository.save(store);

    return updatedStore;
  }

  async delete(id: number, manager?: EntityManager): Promise<void> {
    const repository = manager
      ? manager.getRepository(StoreOrmEntity)
      : this.storeRepository;

    const store = await repository.findOne({
      where: { id },
    });

    if (!store) {
      throw new Error('Store not found');
    }

    await repository.softDelete(id);
  }

  async uploadStoreLogo(
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
        imageUrl: this.amazonS3ServiceKey.getCloudFrontImageUrl(fileKey),
      };
    }
    throw new Error('No file provided');
  }

  private async generateUniqueStoreNo(manager: EntityManager): Promise<string> {
    return generateUniqueNo(
      MAX_GENERATE_CODE_LENGTH,
      async (code) => {
        const existing = await manager.findOne(StoreOrmEntity, {
          where: { store_no: code },
        });
        return !!existing;
      },
      E_COMMERCE,
    );
  }

  private async generateUniqueCustomerCode(
    manager: EntityManager,
  ): Promise<string> {
    return generateUniqueNo(
      MAX_GENERATE_CODE_LENGTH,
      async (code) => {
        const existing = await manager.findOne(UserOrmEntity, {
          where: { user_no: code },
        });
        return !!existing;
      },
      E_COMMERCE,
    );
  }
}
