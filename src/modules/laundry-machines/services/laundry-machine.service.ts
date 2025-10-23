import { Injectable, Inject } from '@nestjs/common';
import { ILaundryMachineServiceInterface } from '../interfaces/service.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { LaundryMachineOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/laundry-machine.orm';
import { Repository, EntityManager } from 'typeorm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { CreateLaundryMachineDto } from '../dtos/create.dto';
import { LaundryMachineQueryDto } from '../dtos/query/query.dto';
import { UpdateLaundryMachineDto } from '../dtos/update.dto';

@Injectable()
export class LaundryMachineService implements ILaundryMachineServiceInterface {
  constructor(
    @InjectRepository(LaundryMachineOrmEntity)
    private readonly laundryMachineRepository: Repository<LaundryMachineOrmEntity>,
  ) {}

  async create(
    body: CreateLaundryMachineDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<LaundryMachineOrmEntity>> {
    const repository = manager
      ? manager.getRepository(LaundryMachineOrmEntity)
      : this.laundryMachineRepository;

    const laundryMachine = repository.create(body);
    const savedLaundryMachine = await repository.save(laundryMachine);

    return savedLaundryMachine;
  }

  async getAll(query: LaundryMachineQueryDto): Promise<ResponseResult<LaundryMachineOrmEntity>> {
    const {
      page = 1,
      limit = 10,
      search,
      sort_by = 'created_at',
      sort_order = 'DESC',
    } = query;

    const queryBuilder = this.laundryMachineRepository
      .createQueryBuilder('laundryMachine')
      .where('laundryMachine.deleted_at IS NULL');

    if (search) {
      queryBuilder.andWhere(
        '(laundryMachine.name ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (query.name) {
      queryBuilder.andWhere('laundryMachine.name ILIKE :name', {
        name: `%${query.name}%`,
      });
    }

    queryBuilder
      .orderBy(`laundryMachine.${sort_by}`, sort_order)
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

  async getOne(id: number): Promise<ResponseResult<LaundryMachineOrmEntity>> {
    const laundryMachine = await this.laundryMachineRepository.findOne({
      where: { id },
    });

    if (!laundryMachine) {
      throw new Error('Laundry machine not found');
    }

    return laundryMachine;
  }

  async update(
    id: number,
    body: UpdateLaundryMachineDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<LaundryMachineOrmEntity>> {
    const repository = manager
      ? manager.getRepository(LaundryMachineOrmEntity)
      : this.laundryMachineRepository;

    const laundryMachine = await repository.findOne({
      where: { id },
    });

    if (!laundryMachine) {
      throw new Error('Laundry machine not found');
    }

    Object.assign(laundryMachine, body);
    const updatedLaundryMachine = await repository.save(laundryMachine);

    return updatedLaundryMachine;
  }

  async delete(id: number, manager?: EntityManager): Promise<void> {
    const repository = manager
      ? manager.getRepository(LaundryMachineOrmEntity)
      : this.laundryMachineRepository;

    const laundryMachine = await repository.findOne({
      where: { id },
    });

    if (!laundryMachine) {
      throw new Error('Laundry machine not found');
    }

    await repository.softDelete(id);
  }
}