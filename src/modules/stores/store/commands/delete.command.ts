import { EntityManager } from 'typeorm';

export class DeleteCommand {
  constructor(
    public id: number,
    public manager: EntityManager,
  ) {}
}
