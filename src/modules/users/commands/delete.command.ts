import { EntityManager } from 'typeorm';

export class deleteCommand {
  constructor(
    public readonly id: number,
    public readonly manager: EntityManager,
  ) {}
}
