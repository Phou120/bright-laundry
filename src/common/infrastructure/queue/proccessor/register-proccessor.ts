import {
  InjectQueue,
  OnWorkerEvent,
  Processor,
  WorkerHost,
} from '@nestjs/bullmq';
import { Job, Queue } from 'bullmq';
import { JOB_NAMES, QUEUE_NAMES } from '../inject-key';
@Processor(QUEUE_NAMES.SEND_OTP_QUEUE)
export class QueueProcessor extends WorkerHost {
  constructor(
    @InjectQueue(QUEUE_NAMES.SEND_OTP_QUEUE)
    protected readonly defaultQueue: Queue,
    // private readonly repository: ArrivalRegistrationRepository,
  ) {
    super();
  }

  async process(job: Job): Promise<any> {
    console.log('process job: ', job.name);
    try {
      return await this.handleJob(job);
    } catch (error) {
      console.error(
        `Error processing job ${job.id} with name ${job.name}:`,
        error,
      );
      throw error;
    }
  }

  private handleJob(job: Job): unknown {
    switch (job.name) {
      case JOB_NAMES.SEND_OTP_JOB: {
        // TODO: implement actual OTP sending logic
        console.log(`Handled OTP job ${job.id}`);
        return job.data;
      }
      case JOB_NAMES.SEND_MAIL_JOB: {
        // TODO: implement actual mail sending logic
        console.log(`Handled send mail job ${job.id}`);
        return job.data;
      }
      default:
        throw new Error(`Unhandled job name: ${job.name}`);
    }
  }

  // private async processSendOTPJob(job: Job): Promise<unknown> {
  //   const { approver, otp } = job.data;

  //   try {
  //     //   await this._unitelService.sendOTPWithUnitel({
  //     //     tel: approver.tel,
  //     //     otp,
  //     //   });

  //     console.log(`OTP sent successfully to ${approver.tel} at ${new Date()}`);

  //     return job.data;
  //   } catch (error) {
  //     console.error(`Failed to send OTP to ${approver.tel}:`, error.message);

  //     throw new Error(
  //       `OTP sending failed for ${approver.tel}: ${error.message}`,
  //     );
  //   }
  // }

  @OnWorkerEvent('active')
  onActive(job: Job) {
    console.log(`Queue job ${job.id} with name ${job.name} is now active.`);
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    console.log(
      `Queue job ${job.id} with name ${job.name} completed successfully.`,
    );
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, err: Error) {
    console.error(
      `Queue job ${job.id} with name ${job.name} failed with error: ${err.message}`,
    );
  }
}
