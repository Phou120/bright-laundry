import { Injectable } from '@nestjs/common';
import { ITaxServiceInterface } from '../interfaces/service.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { TaxOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/tax.orm';
import { StoreOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/store.orm';
import { Repository, EntityManager } from 'typeorm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { CreateTaxDto } from '../dtos/create.dto';
import { TaxQueryDto } from '../dtos/query/query.dto';
import { UpdateTaxDto } from '../dtos/update.dto';

@Injectable()
export class TaxService implements ITaxServiceInterface {
  constructor(
    @InjectRepository(TaxOrmEntity)
    private readonly taxRepository: Repository<TaxOrmEntity>,
  ) {}

  async create(
    body: CreateTaxDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<TaxOrmEntity>> {
    const repository = manager
      ? manager.getRepository(TaxOrmEntity)
      : this.taxRepository;

    const tax = repository.create(body);
    const savedTax = await repository.save(tax);

    return savedTax;
  }

  async getAll(query: TaxQueryDto): Promise<ResponseResult<TaxOrmEntity>> {
    const {
      page = 1,
      limit = 10,
      search,
      sort_by = 'created_at',
      sort_order = 'DESC',
    } = query;

    const queryBuilder = this.taxRepository
      .createQueryBuilder('tax')
      .where('tax.deleted_at IS NULL');

    if (search) {
      queryBuilder.andWhere(
        '(tax.name ILIKE :search OR CAST(tax.percentage AS TEXT) ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (query.name) {
      queryBuilder.andWhere('tax.name ILIKE :name', {
        name: `%${query.name}%`,
      });
    }

    if (query.min_percentage !== undefined) {
      queryBuilder.andWhere('tax.percentage >= :min_percentage', {
        min_percentage: query.min_percentage,
      });
    }

    if (query.max_percentage !== undefined) {
      queryBuilder.andWhere('tax.percentage <= :max_percentage', {
        max_percentage: query.max_percentage,
      });
    }

    queryBuilder
      .orderBy(`tax.${sort_by}`, sort_order)
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

  async getOne(id: number): Promise<ResponseResult<TaxOrmEntity>> {
    const tax = await this.taxRepository.findOne({
      where: { id },
      relations: ['stores'],
    });

    if (!tax) {
      throw new Error('Tax not found');
    }

    return tax;
  }

  async update(
    id: number,
    body: UpdateTaxDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<TaxOrmEntity>> {
    const repository = manager
      ? manager.getRepository(TaxOrmEntity)
      : this.taxRepository;

    const tax = await repository.findOne({
      where: { id },
    });

    if (!tax) {
      throw new Error('Tax not found');
    }

    Object.assign(tax, body);
    const updatedTax = await repository.save(tax);

    return updatedTax;
  }

  async delete(id: number, manager?: EntityManager): Promise<void> {
    const repository = manager
      ? manager.getRepository(TaxOrmEntity)
      : this.taxRepository;

    const tax = await repository.findOne({
      where: { id },
    });

    if (!tax) {
      throw new Error('Tax not found');
    }

    await repository.softDelete(id);
  }
}