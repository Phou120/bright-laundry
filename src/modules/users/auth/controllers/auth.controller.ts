import { Body, Controller, Inject, Post } from '@nestjs/common';
import { IAuthServiceInterface } from '../interfaces/service.interface';
import { AUTH_SERVICE } from '@src/common/constants/inject-key';
import { AuthDto } from '../dtos/auth.dto';
import { Public } from '@src/common/decorator/auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AUTH_SERVICE)
    private readonly _authService: IAuthServiceInterface,
  ) {}

  @Public()
  @Post('login')
  async signIn(@Body() body: AuthDto): Promise<string> {
    const result = await this._authService.signIn(body);
    return result;
  }
}
