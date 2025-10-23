import { Injectable } from '@nestjs/common';
import { ICustomerServiceInterface } from '../interfaces/service.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/customer.orm';
import { Repository, EntityManager } from 'typeorm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { CreateCustomerDto } from '../dtos/create.dto';
import { CustomerQueryDto } from '../dtos/query/query.dto';
import { UpdateCustomerDto } from '../dtos/update.dto';

@Injectable()
export class CustomerService implements ICustomerServiceInterface {
  constructor(
    @InjectRepository(CustomerOrmEntity)
    private readonly customerRepository: Repository<CustomerOrmEntity>,
  ) {}

  async create(
    body: CreateCustomerDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<CustomerOrmEntity>> {
    const repository = manager
      ? manager.getRepository(CustomerOrmEntity)
      : this.customerRepository;

    const customer = repository.create(body);
    const savedCustomer = await repository.save(customer);

    return savedCustomer;
  }

  async getAll(
    query: CustomerQueryDto,
  ): Promise<ResponseResult<CustomerOrmEntity>> {
    const {
      page = 1,
      limit = 10,
      search,
      sort_by = 'created_at',
      sort_order = 'DESC',
    } = query;

    const queryBuilder = this.customerRepository
      .createQueryBuilder('customer')
      .where('customer.deleted_at IS NULL');

    if (search) {
      queryBuilder.andWhere(
        '(customer.name ILIKE :search OR customer.surname ILIKE :search OR customer.tel ILIKE :search OR customer.email ILIKE :search OR customer.address ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (query.name) {
      queryBuilder.andWhere('customer.name ILIKE :name', {
        name: `%${query.name}%`,
      });
    }

    if (query.surname) {
      queryBuilder.andWhere('customer.surname ILIKE :surname', {
        surname: `%${query.surname}%`,
      });
    }

    if (query.tel) {
      queryBuilder.andWhere('customer.tel ILIKE :tel', {
        tel: `%${query.tel}%`,
      });
    }

    if (query.email) {
      queryBuilder.andWhere('customer.email ILIKE :email', {
        email: `%${query.email}%`,
      });
    }

    if (query.address) {
      queryBuilder.andWhere('customer.address ILIKE :address', {
        address: `%${query.address}%`,
      });
    }

    queryBuilder
      .orderBy(`customer.${sort_by}`, sort_order)
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

  async getOne(id: number): Promise<ResponseResult<CustomerOrmEntity>> {
    const customer = await this.customerRepository.findOne({
      where: { id },
    });

    if (!customer) {
      throw new Error('Customer not found');
    }

    return customer;
  }

  async update(
    id: number,
    body: UpdateCustomerDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<CustomerOrmEntity>> {
    const repository = manager
      ? manager.getRepository(CustomerOrmEntity)
      : this.customerRepository;

    const customer = await repository.findOne({
      where: { id },
    });

    if (!customer) {
      throw new Error('Customer not found');
    }

    Object.assign(customer, body);
    const updatedCustomer = await repository.save(customer);

    return updatedCustomer;
  }

  async delete(id: number, manager?: EntityManager): Promise<void> {
    const repository = manager
      ? manager.getRepository(CustomerOrmEntity)
      : this.customerRepository;

    const customer = await repository.findOne({
      where: { id },
    });

    if (!customer) {
      throw new Error('Customer not found');
    }

    await repository.softDelete(id);
  }
}
