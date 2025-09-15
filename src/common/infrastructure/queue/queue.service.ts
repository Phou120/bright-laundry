import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { JOB_NAMES, QUEUE_NAMES } from './inject-key';
import { RegisterSuccessEvent } from '@src/modules/users/events/register-success.event';
import { EventBus } from '@nestjs/cqrs';

@Injectable()
export class QueueService {
  constructor(
    @InjectQueue(QUEUE_NAMES.SEND_OTP_QUEUE)
    private readonly _sendOtpQueue: Queue,
    private readonly _eventBus: EventBus,
  ) {}

  async sendOTPJob(data: object): Promise<void> {
    const job = await this._sendOtpQueue.add(JOB_NAMES.SEND_OTP_JOB, data, {
      delay: 0, // ไม่ delay
      attempts: 3, // retry 3 ครั้งถ้าล้มเหลว
    });

    console.log('OTP added to queue:', job.id);
  }

  async sendMail(data: object): Promise<void> {
    const job = await this._sendOtpQueue.add(JOB_NAMES.SEND_MAIL_JOB, data, {
      delay: 0, // ไม่ delay
      attempts: 3, // retry 3 ครั้งถ้าล้มเหลว
    });
    await this._eventBus.publish(new RegisterSuccessEvent(job.data));
  }
}
