import { Injectable } from '@nestjs/common';
import { IClothesServiceInterface } from '../interfaces/service.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { ClothesOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/clothe.orm';
import { Repository, EntityManager } from 'typeorm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { CreateClothesDto } from '../dtos/create.dto';
import { ClothesQueryDto } from '../dtos/query/query.dto';
import { UpdateClothesDto } from '../dtos/update.dto';
import { DomainException } from '@src/common/exceptions/domain.exception';

@Injectable()
export class ClothesService implements IClothesServiceInterface {
  constructor(
    @InjectRepository(ClothesOrmEntity)
    private readonly clothesRepository: Repository<ClothesOrmEntity>,
  ) {}

  async create(
    body: CreateClothesDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<ClothesOrmEntity>> {
    const repository = manager
      ? manager.getRepository(ClothesOrmEntity)
      : this.clothesRepository;

    const clothes = repository.create(body);
    const savedClothes = await repository.save(clothes);

    return savedClothes;
  }

  async getAll(
    query: ClothesQueryDto,
  ): Promise<ResponseResult<ClothesOrmEntity>> {
    const {
      page = 1,
      limit = 10,
      search,
      sort_by = 'created_at',
      sort_order = 'DESC',
    } = query;

    const queryBuilder = this.clothesRepository
      .createQueryBuilder('clothes')
      .where('clothes.deleted_at IS NULL');

    if (search) {
      queryBuilder.andWhere('(clothes.name ILIKE :search)', {
        search: `%${search}%`,
      });
    }

    if (query.name) {
      queryBuilder.andWhere('clothes.name ILIKE :name', {
        name: `%${query.name}%`,
      });
    }

    // if (query.min_price !== undefined) {
    //   queryBuilder.andWhere('clothes.price >= :min_price', {
    //     min_price: query.min_price,
    //   });
    // }

    // if (query.max_price !== undefined) {
    //   queryBuilder.andWhere('clothes.price <= :max_price', {
    //     max_price: query.max_price,
    //   });
    // }

    // Price range filter
    // if (query.min_price !== undefined && query.max_price !== undefined) {
    //   queryBuilder.andWhere('clothes.price BETWEEN :min_price AND :max_price', {
    //     min_price: query.min_price,
    //     max_price: query.max_price,
    //   });
    // }

    queryBuilder
      .orderBy(`clothes.${sort_by}`, sort_order)
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    const mapDate = data.map((item) => {
      item.price = Number(item.price);
      return item;
    });

    return {
      data: mapDate,
      pagination: {
        total,
        total_pages: Math.ceil(total / limit),
        page,
        limit,
      },
    };
  }

  async getOne(id: number): Promise<ResponseResult<ClothesOrmEntity>> {
    const clothes = await this.clothesRepository.findOne({
      where: { id },
    });

    if (!clothes) {
      throw new DomainException('Clothes not found', 404);
    }

    clothes.price = Number(clothes.price);

    return clothes;
  }

  async update(
    id: number,
    body: UpdateClothesDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<ClothesOrmEntity>> {
    const repository = manager
      ? manager.getRepository(ClothesOrmEntity)
      : this.clothesRepository;

    const clothes = await repository.findOne({
      where: { id },
    });

    if (!clothes) {
      throw new DomainException('Clothes not found', 404);
    }

    Object.assign(clothes, body);
    const updatedClothes = await repository.save(clothes);

    return updatedClothes;
  }

  async delete(id: number, manager?: EntityManager): Promise<void> {
    const repository = manager
      ? manager.getRepository(ClothesOrmEntity)
      : this.clothesRepository;

    const clothes = await repository.findOne({
      where: { id },
    });

    if (!clothes) {
      throw new DomainException('Clothes not found', 404);
    }

    await repository.softDelete(id);
  }
}
