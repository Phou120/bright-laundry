import { EntityManager } from 'typeorm';
import { CreateProductDto } from '../dtos/create/create.dto';

export class CreateProductCommand {
  constructor(
    public readonly body: CreateProductDto,
    public readonly manager: EntityManager,
  ) {}
}