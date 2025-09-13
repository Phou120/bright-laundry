import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UploadMultipleCommand } from '../upload-multiple.command';
import { Inject } from '@nestjs/common';
import { AMAZON_S3_SERVICE_KEY } from '@src/common/infrastructure/aws3/config/inject-key';
import { IAmazonS3ImageService } from '@src/common/infrastructure/aws3/interface/amazon-s3-image-service.interface';
import { optimizeImage } from '@src/common/utils/image-optimize.util';

@CommandHandler(UploadMultipleCommand)
export class UploadMultipleHandler
  implements ICommandHandler<UploadMultipleCommand, { imageUrls: string[] }>
{
  constructor(
    @Inject(AMAZON_S3_SERVICE_KEY)
    private readonly _amazonS3ServiceKey: IAmazonS3ImageService,
  ) {}

  async execute(
    command: UploadMultipleCommand,
  ): Promise<{ imageUrls: string[] }> {
    const imageUrls: string[] = [];

    for (const file of command.files) {
      const optimizedImage = await optimizeImage(file);
      const s3ImageResponse =
        await this._amazonS3ServiceKey.uploadFile(optimizedImage);
      imageUrls.push(s3ImageResponse.fileKey);
    }

    return {
      imageUrls,
    };
  }
}
