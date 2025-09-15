import { EntityManager } from 'typeorm';
import { SendMailDto } from '../dtos/send-mail.dto';

export class SendMailCommand {
  constructor(
    public readonly body: SendMailDto,
    public readonly manager: EntityManager,
  ) {}
}
