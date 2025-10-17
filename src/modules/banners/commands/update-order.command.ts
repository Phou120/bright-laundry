import { EntityManager } from 'typeorm';
import { UpdateOrderDto } from '../dtos/update-order.dto';

export class UpdateOrderCommand {
  constructor(
    public readonly body: UpdateOrderDto,
    public readonly manager: EntityManager,
  ) {}
}
