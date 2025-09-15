import { Module } from '@nestjs/common';
import { userProvider } from './providers/index.provider';
import { UserController } from './controllers/user.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { PermissionController } from './controllers/permission.controller';
import { RoleController } from './controllers/role.controller';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '@src/common/constants/jwt.constant';
import { MyQueueModule } from '@src/common/infrastructure/queue/queue.module';

@Module({
  imports: [
    CqrsModule,
    MyQueueModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expiresIn },
    }),
  ],
  controllers: [UserController, PermissionController, RoleController],
  providers: [...userProvider],
  exports: [...userProvider],
})
export class UserModule {}
