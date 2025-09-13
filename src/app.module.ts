import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { IndexModule } from './modules/index.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './modules/users/auth/guards/jwt.guard';

@Module({
  imports: [CommonModule, IndexModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
