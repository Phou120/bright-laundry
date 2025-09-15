import { EntityManager } from 'typeorm';
import { VerifyOtpDto } from '../dtos/verify-otp.dto';

export class VerifyOtpCommand {
  constructor(
    public readonly body: VerifyOtpDto,
    public readonly manager: EntityManager,
  ) {}
}
