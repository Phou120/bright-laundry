import { EntityManager } from 'typeorm';

export class UploadMultipleCommand {
  constructor(
    public readonly files: Express.Multer.File[],
    public readonly manager: EntityManager,
  ) {}
}
