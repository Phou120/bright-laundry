import { EntityManager } from 'typeorm';
import { UpdateProductDto } from '../dtos/create/update.dto';

export class UpdateProductCommand {
  constructor(
    public readonly id: number,
    public readonly body: UpdateProductDto,
    public readonly manager: EntityManager,
  ) {}
}