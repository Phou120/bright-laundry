import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UploadCommand } from '../upload.command';
import { Inject } from '@nestjs/common';
import { AMAZON_S3_SERVICE_KEY } from '@src/common/infrastructure/aws3/config/inject-key';
import { IAmazonS3ImageService } from '@src/common/infrastructure/aws3/interface/amazon-s3-image-service.interface';
import { optimizeImage } from '@src/common/utils/image-optimize.util';

@CommandHandler(UploadCommand)
export class UploadHandler
  implements ICommandHandler<UploadCommand, { imageUrl: string }>
{
  constructor(
    @Inject(AMAZON_S3_SERVICE_KEY)
    private readonly _amazonS3ServiceKey: IAmazonS3ImageService,
  ) {}

  async execute(command: UploadCommand): Promise<{ imageUrl: string }> {
    let fileKey: string | null = null;
    if (command.file) {
      const optimizedImage = await optimizeImage(command.file);
      const s3ImageResponse =
        await this._amazonS3ServiceKey.uploadFile(optimizedImage);
      fileKey = s3ImageResponse.fileKey;
    }

    return {
      imageUrl: fileKey ?? '',
    };
  }
}
