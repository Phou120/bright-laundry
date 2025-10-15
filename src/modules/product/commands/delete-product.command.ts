import { EntityManager } from 'typeorm';

export class DeleteProductCommand {
  constructor(
    public readonly id: number,
    public readonly manager: EntityManager,
  ) {}
}