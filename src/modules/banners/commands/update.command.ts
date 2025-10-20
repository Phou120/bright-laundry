import { ICommand } from '@nestjs/cqrs';
import { UpdateBannerDto } from '../dtos/update.dto';
import { EntityManager } from 'typeorm';

export class UpdateBannerCommand implements ICommand {
  constructor(
    public readonly id: number,
    public readonly body: UpdateBannerDto,
    public readonly manager: EntityManager,
  ) {}
}