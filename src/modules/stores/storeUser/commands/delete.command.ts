import { EntityManager } from 'typeorm';

export class DeleteStoreUserCommand {
  constructor(
    public readonly userId: number,
    public readonly id: number,
    public readonly manager: EntityManager,
  ) {}
}
