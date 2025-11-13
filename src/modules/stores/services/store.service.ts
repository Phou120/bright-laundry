import { Injectable, Inject } from '@nestjs/common';
import { IStoreServiceInterface } from '../interfaces/service.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { StoreOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/store.orm';
import { UserOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/user.orm';
import { StoreUserOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/store-user.orm';
import { Repository, EntityManager } from 'typeorm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import {
  CreateStoreAndUserDto,
  CreateStoreDto,
  CreateUserStoreDto,
} from '../dtos/create.dto';
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
import { UserProfileOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/user-profile.orm';
import { DomainException } from '@src/common/exceptions/domain.exception';

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
    body: CreateStoreAndUserDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<StoreOrmEntity>> {
    // Use the provided manager or the default repository manager to initiate the transaction.
    const transactionalManager = manager
      ? manager
      : this.storeRepository.manager;

    // Run all operations within a single transaction to ensure atomicity
    const savedStore = await transactionalManager.transaction(
      async (txManager: EntityManager) => {
        // --- 1. Get Repositories from the Transaction Manager ---
        const storeRepo = txManager.getRepository(StoreOrmEntity);
        const userRepo = txManager.getRepository(UserOrmEntity);
        const roleRepo = txManager.getRepository(RoleOrmEntity);
        const storeUserRepo = txManager.getRepository(StoreUserOrmEntity);
        const userProfileRepo = txManager.getRepository(UserProfileOrmEntity);

        // --- 2. Generate unique numbers ---
        const store_no = await this.generateUniqueStoreNo(txManager);
        const user_no = await this.generateUniqueCustomerCode(txManager);

        const check_email = await userRepo.findOne({
          where: { email: body.email },
        });

        if (check_email) {
          throw new DomainException('Email already exists.', 400);
        }

        const check_tel = await userRepo.findOne({
          where: { tel: body.tel },
        });

        if (check_tel) {
          throw new DomainException('Phone number already exists.', 400);
        }

        // --- 3. Find the Default Role ---
        // This is necessary to link the user to the role later.
        const defaultRole = await roleRepo.findOne({
          where: { name: 'storemanager' }, // Ensure this role exists
        });

        if (!defaultRole) {
          // If the default role isn't found, throw an error to roll back the transaction
          throw new Error('Default role "storemanager" not found.');
        }

        // --- 4. Create and Save the Store ---
        const storeData = {
          ...body,
          store_no,
          name: body.store_name,
          email: body.store_email,
        };

        const store = storeRepo.create(storeData);
        const savedStore = await storeRepo.save(store);

        // --- 5. Create and Save the User ---
        const hashedPassword = await hashPassword(body.password);

        const userData = Object.assign({}, body, {
          user_no,
          // The DTO must have fields like name, surname, email, tel, etc.
          name: body.name,
          surname: body.surname,
          email: body.email,
          tel: body.tel,
          password: hashedPassword,
          // Assign the role(s) as an ARRAY for the Many-to-Many relationship
          roles: [defaultRole],
        });

        const user = userRepo.create(userData);
        // Saving the user with the 'roles' array automatically creates the link in 'role_users'
        const savedUser = await userRepo.save(user);

        // --- 6. Create and Save the StoreUser Link ---
        const storeUser = storeUserRepo.create({
          store_id: savedStore.id,
          user_id: savedUser.id,
        });
        await storeUserRepo.save(storeUser);

        await userProfileRepo.save({
          user_id: savedUser.id,
          profile: body.profile,
        });
        // Return the successfully created store
        return savedStore;
      },
    );

    // Assuming ResponseResult is a simple wrapper, adjust if needed
    return savedStore;
  }

  async createWithUser(
    userId: number,
    body: CreateUserStoreDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<UserOrmEntity>> {
    const storeUserManager = manager
      ? manager
      : this.storeUserRepository.manager;

    return await storeUserManager.transaction(async (transactionManager) => {
      const storeRepo = transactionManager.getRepository(StoreOrmEntity);
      const storeUserRepo =
        transactionManager.getRepository(StoreUserOrmEntity);
      const userRepo = transactionManager.getRepository(UserOrmEntity);
      const roleRepo = transactionManager.getRepository(RoleOrmEntity);
      const userProfile =
        transactionManager.getRepository(UserProfileOrmEntity);
      const user_no = await this.generateUniqueCustomerCode(storeUserManager);

      const check_email = await userRepo.findOne({
        where: { email: body.email },
      });

      if (check_email) {
        throw new DomainException('Email already exists.', 400);
      }

      const check_tel = await userRepo.findOne({
        where: { tel: body.tel },
      });

      if (check_tel) {
        throw new DomainException('Phone number already exists.', 400);
      }

      const defaultRole = await roleRepo.findOne({
        where: { name: 'store-user' }, // Ensure this role exists
      });
      if (!defaultRole) {
        throw new DomainException('Default role "store-user" not found.', 404);
      }

      const find_store_id = await storeUserRepo.findOne({
        where: { user_id: userId },
      });

      if (!find_store_id) {
        throw new DomainException('Store not found.', 404);
      }

      const store = await storeRepo.findOne({
        where: { id: find_store_id.store_id },
      });

      if (!store) {
        throw new DomainException('Store not found.', 404);
      }

      const hashedPassword = await hashPassword(body.password);

      const userData = Object.assign({}, body, {
        user_no,
        // The DTO must have fields like name, surname, email, tel, etc.
        name: body.name,
        surname: body.surname,
        email: body.email,
        tel: body.tel,
        password: hashedPassword,
        // Assign the role(s) as an ARRAY for the Many-to-Many relationship
        roles: [defaultRole],
      });

      const user = userRepo.create(userData);
      // Saving the user with the 'roles' array automatically creates the link in 'role_users'
      const savedUser = await userRepo.save(user);

      if (!savedUser) {
        throw new DomainException('User not found.', 400);
      }

      const storeUser = storeUserRepo.create({
        store_id: store.id,
        user_id: savedUser.id,
      });
      await storeUserRepo.save(storeUser);

      await userProfile.save({
        user_id: savedUser.id,
        profile: body.profile,
      });

      return savedUser;
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

  async getAllUser(
    userId: number,
    query: StoreQueryDto,
  ): Promise<ResponseResult<UserOrmEntity>> {
    const {
      page = 1,
      limit = 10,
      search,
      sort_by = 'created_at',
      sort_order = 'DESC',
    } = query;

    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'roles')
      .leftJoinAndSelect('user.user_profile', 'user_profile')
      .leftJoinAndSelect('user.store_users', 'store_users')
      .leftJoinAndSelect('store_users.store', 'store')
      .where('user.deleted_at IS NULL')
      .andWhere('store_users.store_id = :store_id', { store_id: userId });

    if (search) {
      queryBuilder.andWhere(
        '(user.name ILIKE :search OR user.email ILIKE :search OR user.tel ILIKE :search OR user.surname ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    queryBuilder
      .orderBy(`user.${sort_by}`, sort_order)
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    const mappedData = data.map((user) => {
      // Check if the user has a profile and an image filename
      if (user.user_profile && user.user_profile.image) {
        // Construct the full URL and assign it to a new property or overwrite the existing one
        const baseUrl = process.env.AWS_CLOUDFRONT_DISTRIBUTION_DOMAIN_NAME;

        // Ensure the base URL exists to prevent errors
        if (baseUrl) {
          // Create a new object with the desired properties
          const mappedUser = {
            ...user,
            user_profile: {
              ...user.user_profile,
              image_url: `${baseUrl}/${user.user_profile.image}`,
            },
          };

          return mappedUser;
        }
      }

      return user;
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

    const data = {
      ...body,
      name: body.store_name,
      email: body.store_email,
    };

    Object.assign(store, data);
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

  async deleteUser(id: number, manager?: EntityManager): Promise<void> {
    const transactionalManager = manager
      ? manager
      : this.userRepository.manager;

    await transactionalManager.transaction(async (txManager: EntityManager) => {
      // 1. Get Repositories from the Transaction Manager
      const storeUserRepo = txManager.getRepository(
        this.storeUserRepository.target,
      );
      const userRepo = txManager.getRepository(this.userRepository.target);

      // --- Soft Delete StoreUser Link ---

      // Find the StoreUser link associated with the user ID
      const store_user = await storeUserRepo.findOne({
        where: { user_id: id },
      });

      if (!store_user) {
        throw new DomainException(
          'Store-User not found. User might not be assigned.',
          404,
        );
      }

      // Soft remove the StoreUser link
      await storeUserRepo.softRemove(store_user);

      // --- Soft Delete User Entity ---

      // Find the User entity
      const user = await userRepo.findOne({
        where: { id },
      });

      if (!user) {
        // If the user entity itself is not found, throw an error
        throw new DomainException('User not found', 404);
      }

      // Soft remove the User entity
      await userRepo.softRemove(user);
    });
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
