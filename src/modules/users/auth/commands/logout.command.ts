import { EntityManager } from 'typeorm';

export class LogOutCommand {
  constructor(
    public readonly user_id: number,
    public readonly manager: EntityManager,
  ) {}
}
