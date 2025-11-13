import { Injectable, NotFoundException } from '@nestjs/common';
import { ILaundryMachineServiceInterface } from '../interfaces/service.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { WashingMachineOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/washing-machine.orm';
import { WashingMachineDetailOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/washing-machine-detail.orm';
import { Repository, EntityManager } from 'typeorm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import {
  CreateLaundryMachineDto,
  CreateWashingMachineDetailDto,
} from '../dtos/create.dto';
import { LaundryMachineQueryDto } from '../dtos/query/query.dto';
import { UpdateLaundryMachineDto } from '../dtos/update.dto';
import { Timezone } from '@src/common/value-objects/timezone.vo';
import moment from 'moment';
import { DateFormat } from '@src/common/value-objects/format-date.vo';
import { StoreUserOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/store-user.orm';
import { ClothesOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/clothe.orm';
import { TaxOrmEntity } from '@src/common/infrastructure/database/typeorms/entities/tax.orm';

@Injectable()
export class LaundryMachineService implements ILaundryMachineServiceInterface {
  constructor(
    @InjectRepository(WashingMachineOrmEntity)
    private readonly washingMachineRepository: Repository<WashingMachineOrmEntity>,
    @InjectRepository(WashingMachineDetailOrmEntity)
    private readonly washingMachineDetailRepository: Repository<WashingMachineDetailOrmEntity>,
    @InjectRepository(StoreUserOrmEntity)
    private readonly storeUserRepository: Repository<StoreUserOrmEntity>,
    @InjectRepository(ClothesOrmEntity)
    private readonly clothesRepository: Repository<ClothesOrmEntity>,
    @InjectRepository(TaxOrmEntity)
    private readonly taxRepository: Repository<TaxOrmEntity>,
  ) {}

  async create(
    user_id: number,
    body: CreateLaundryMachineDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<WashingMachineOrmEntity>> {
    const now = moment.tz(Timezone.LAOS).format(DateFormat.DATETIME_FORMAT);

    const washingMachineRepository = manager
      ? manager.getRepository(WashingMachineOrmEntity)
      : this.washingMachineRepository;
    const detailRepository = manager
      ? manager.getRepository(WashingMachineDetailOrmEntity)
      : this.washingMachineDetailRepository;
    const userRepo = manager
      ? manager.getRepository(StoreUserOrmEntity)
      : this.storeUserRepository;
    const clothes = manager
      ? manager.getRepository(ClothesOrmEntity)
      : this.clothesRepository;
    const vat = manager
      ? manager.getRepository(TaxOrmEntity)
      : this.taxRepository;

    console.log('object', user_id);

    const storeUser = await userRepo?.findOne({
      where: { user_id: user_id },
    });
    console.log('object', storeUser);

    if (!storeUser) {
      throw new NotFoundException('Store-User not found.');
    }

    const get_vat = await vat
      ?.createQueryBuilder('vat')
      .orderBy('vat.created_at', 'DESC')
      .take(1)
      .getOne();

    if (!get_vat) {
      throw new NotFoundException('Vat not found.');
    }

    // Since findOne is used, get_vat will be either the single entity or null.

    const washingMachine = washingMachineRepository.create({
      store_id: storeUser.store_id,
      customer_id: body.customer_id,
      washing_date: now,
      created_by: user_id,
      created_at: now,
      updated_at: now,
    });

    const savedWashingMachine =
      await washingMachineRepository.save(washingMachine);

    if (body.details && body.details.length > 0) {
      const detailsToCreate = await Promise.all(
        body.details.map(async (detail) => {
          const check_clothes = await clothes?.findOne({
            where: { id: detail.clothes_id },
          });

          if (!check_clothes) {
            throw new NotFoundException('Clothes not found.');
          }

          return detailRepository.create({
            washing_machine_id: savedWashingMachine.id,
            clothes_id: detail.clothes_id,
            quantity: detail.quantity,
            price: check_clothes.price ?? 0,
            total: detail.quantity * (check_clothes?.price ?? 0),
            vat: get_vat.percentage,
            created_at: now,
            updated_at: now,
          });
        }),
      );

      const savedDetails = await detailRepository.save(detailsToCreate);

      // 4. Attach the saved details back to the main object
      (savedWashingMachine as any).details = savedDetails;
    }

    return savedWashingMachine;
  }

  async getAll(
    query: LaundryMachineQueryDto,
  ): Promise<ResponseResult<WashingMachineOrmEntity>> {
    const {
      page = 1,
      limit = 10,
      search,
      store_id,
      customer_id,
      washing_date_from,
      washing_date_to,
      sort_by = 'created_at',
      sort_order = 'DESC',
    } = query;

    // const relations = this.parseRelations(include);

    const queryBuilder = this.washingMachineRepository
      .createQueryBuilder('washingMachine')
      .leftJoinAndSelect('washingMachine.store', 'store')
      .leftJoinAndSelect('washingMachine.customer', 'customer')
      .leftJoinAndSelect('washingMachine.details', 'details')
      .leftJoinAndSelect('details.clothes', 'clothes')
      .where('washingMachine.deleted_at IS NULL');

    if (search) {
      queryBuilder.andWhere(
        '(store.name ILIKE :search OR customer.name ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (store_id) {
      queryBuilder.andWhere('washingMachine.store_id = :store_id', {
        store_id,
      });
    }

    if (customer_id) {
      queryBuilder.andWhere('washingMachine.customer_id = :customer_id', {
        customer_id,
      });
    }

    if (washing_date_from) {
      queryBuilder.andWhere(
        'washingMachine.washing_date >= :washing_date_from',
        { washing_date_from },
      );
    }

    if (washing_date_to) {
      queryBuilder.andWhere('washingMachine.washing_date <= :washing_date_to', {
        washing_date_to,
      });
    }

    queryBuilder
      .orderBy(`washingMachine.${sort_by}`, sort_order)
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    const mappedData = await Promise.all(
      data.map((item) => {
        let subTotal = 0;
        const vatRate = item.details[0]?.vat ?? 0;

        // Calculate Sub-Total from details
        item.details.forEach((detail) => {
          // Assuming clothes.price is the unit price and detail.quantity is the count
          const unitPrice = Number(detail.total) || 0;
          subTotal += unitPrice;
        });
        const vatAmount = Number(subTotal) * Number(vatRate);
        const totalAmount = Number(subTotal) + Number(vatAmount);

        return {
          ...item, // Spread all existing fields
          sub_total: subTotal,
          vat: Number(vatRate), // Include the rate used for transparency
          total_vat: Number(vatAmount),
          total: totalAmount,
        };
      }),
    );

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

  async getOne(
    id: number,
    // include?: string,
  ): Promise<ResponseResult<WashingMachineOrmEntity>> {
    // const relations = this.parseRelations(include);

    const washingMachine = await this.washingMachineRepository.findOne({
      where: { id },
      relations: ['store', 'customer', 'details', 'details.clothes'],
    });

    if (!washingMachine) {
      throw new NotFoundException('Washing machine not found');
    }

    let subTotal = 0;
    const vatRate = washingMachine.details[0]?.vat ?? 0;

    // Calculate Sub-Total from details
    washingMachine.details.forEach((detail) => {
      // Assuming clothes.price is the unit price and detail.quantity is the count
      const unitPrice = Number(detail.total) || 0;
      subTotal += unitPrice;
    });
    const vatAmount = Number(subTotal) * Number(vatRate);
    const totalAmount = Number(subTotal) + Number(vatAmount);

    const map = {
      ...washingMachine,
      sub_total: subTotal,
      vat: Number(vatRate),
      total_vat: Number(vatAmount),
      total: totalAmount,
    };

    return map;
  }

  async update(
    id: number,
    body: UpdateLaundryMachineDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<WashingMachineOrmEntity>> {
    const washingMachineRepository = manager
      ? manager.getRepository(WashingMachineOrmEntity)
      : this.washingMachineRepository;

    const washingMachine = await washingMachineRepository.findOne({
      where: { id },
      relations: ['details'],
    });

    if (!washingMachine) {
      throw new NotFoundException('Washing machine not found');
    }

    Object.assign(washingMachine, {
      customer_id: body.customer_id ?? washingMachine.customer_id,
    });

    const updatedWashingMachine =
      await washingMachineRepository.save(washingMachine);

    return updatedWashingMachine;
  }

  async delete(id: number, manager?: EntityManager): Promise<void> {
    const repository = manager
      ? manager.getRepository(WashingMachineOrmEntity)
      : this.washingMachineRepository;

    const washingMachine = await repository.findOne({
      where: { id },
    });

    if (!washingMachine) {
      throw new NotFoundException('Washing machine not found');
    }

    await repository.softDelete(id);
  }

  // Detail operations
  async addDetail(
    washingMachineId: number,
    detailData: CreateWashingMachineDetailDto,
    manager?: EntityManager,
  ): Promise<WashingMachineDetailOrmEntity> {
    const detailRepository = manager
      ? manager.getRepository(WashingMachineDetailOrmEntity)
      : this.washingMachineDetailRepository;

    const washingMachine = await this.washingMachineRepository.findOne({
      where: { id: washingMachineId },
    });

    if (!washingMachine) {
      throw new NotFoundException('Washing machine not found');
    }

    const detail = detailRepository.create({
      washing_machine_id: washingMachineId,
      ...detailData,
    });

    return await detailRepository.save(detail);
  }

  async updateDetail(
    detailId: number,
    detailData: any,
    manager?: EntityManager,
  ): Promise<WashingMachineDetailOrmEntity> {
    const detailRepository = manager
      ? manager.getRepository(WashingMachineDetailOrmEntity)
      : this.washingMachineDetailRepository;

    const detail = await detailRepository.findOne({
      where: { id: detailId },
    });

    if (!detail) {
      throw new NotFoundException('Washing machine detail not found');
    }

    Object.assign(detail, detailData);
    return await detailRepository.save(detail);
  }

  async removeDetail(detailId: number, manager?: EntityManager): Promise<void> {
    const detailRepository = manager
      ? manager.getRepository(WashingMachineDetailOrmEntity)
      : this.washingMachineDetailRepository;

    const detail = await detailRepository.findOne({
      where: { id: detailId },
    });

    if (!detail) {
      throw new NotFoundException('Washing machine detail not found');
    }

    await detailRepository.softDelete(detailId);
  }

  private parseRelations(include?: string): string[] {
    if (!include) return [];

    const allowedRelations = [
      'store',
      'customer',
      'details',
      'details.clothes',
    ];
    const requestedRelations = include.split(',').map((r) => r.trim());

    return requestedRelations.filter((relation) =>
      allowedRelations.includes(relation),
    );
  }
}
