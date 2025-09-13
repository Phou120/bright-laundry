import { TokenPayload } from '@src/common/interfaces/token-payload.interface';

export class ValidateTokenPayloadCommand {
  constructor(
    public readonly payload: TokenPayload,
    public readonly token?: string,
  ) {}
}
