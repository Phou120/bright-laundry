import { Module } from '@nestjs/common';
import { UserModule } from '../user.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './guards/jwt.strategy';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { authProvider } from './provider';
import { CqrsModule } from '@nestjs/cqrs';
import { jwtConstants } from '@src/common/constants/jwt.constant';

@Module({
  imports: [
    CqrsModule,
    UserModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expiresIn },
    }),
  ],
  providers: [AuthService, JwtStrategy, ...authProvider],
  controllers: [AuthController],
  exports: [JwtModule],
})
export class AuthModule {}
