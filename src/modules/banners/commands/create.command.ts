import { ICommand } from '@nestjs/cqrs';
import { CreateBannerDto } from '../dtos/create.dto';
import { EntityManager } from 'typeorm';

export class CreateBannerCommand implements ICommand {
  constructor(
    public readonly body: CreateBannerDto,
    public readonly manager: EntityManager,
  ) {}
}