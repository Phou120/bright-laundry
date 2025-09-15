import { Global, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { CqrsModule } from '@nestjs/cqrs';
import { QueueService } from './queue.service';
import { QueueProcessor } from './proccessor/register-proccessor';
import { QUEUE_NAMES } from './inject-key';
import { QUEUE_SERVICE } from '@src/common/constants/inject-key';

@Global()
@Module({
  imports: [
    CqrsModule,
    // Configure BullMQ (Redis connection)
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: parseInt(process.env.REDIS_PORT ?? '6379', 10),
        password: process.env.REDIS_PASSWORD || '12345678',
      },
    }),
    // Register the queue so InjectQueue("mail-queue") is available
    BullModule.registerQueue({
      name: QUEUE_NAMES.SEND_OTP_QUEUE,
    }),
  ],
  providers: [
    QueueService,
    QueueProcessor,
    // Expose a token-based alias for QueueService so other modules can inject by QUEUE_SERVICE
    {
      provide: QUEUE_SERVICE,
      useExisting: QueueService,
    },
  ],
  exports: [QueueService, QUEUE_SERVICE],
})
export class MyQueueModule {}
