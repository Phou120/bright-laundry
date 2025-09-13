import { EntityManager } from 'typeorm';

export class UploadCommand {
  constructor(
    public readonly file: Express.Multer.File,
    public readonly manager: EntityManager,
  ) {}
}
