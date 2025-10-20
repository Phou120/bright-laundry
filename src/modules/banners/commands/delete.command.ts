import { ICommand } from '@nestjs/cqrs';
import { EntityManager } from 'typeorm';

export class DeleteBannerCommand implements ICommand {
  constructor(
    public readonly id: number,
    public readonly manager: EntityManager,
  ) {}
}