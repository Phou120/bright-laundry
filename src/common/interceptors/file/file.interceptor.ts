import { FileMimeTypeValidator } from '@common//validations/file-mime-type.validator';
import { FileSizeValidator } from '@common/validations/file-size.validator';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class FileValidationInterceptor implements NestInterceptor {
  constructor(
    private readonly mimeTypeValidator: FileMimeTypeValidator,
    private readonly sizeValidator: FileSizeValidator,
    private readonly fileField: string,
    private readonly isRequired: boolean = false,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const isFieldMatch = (fieldname: string): boolean => {
      // Support exact match (images), array notation (images[]), and indexed (images[0])
      if (!fieldname) return false;
      if (fieldname === this.fileField) return true;
      if (fieldname === `${this.fileField}[]`) return true;
      if (fieldname.startsWith(`${this.fileField}[`)) return true;
      return false;
    };
    let filteredFiles: Express.Multer.File | Express.Multer.File[] | null;
    if (Array.isArray(request.files)) {
      const files = request.files || [];
      filteredFiles = files.filter((file) => isFieldMatch(file.fieldname));
    } else if (request.file) {
      const file = request.file;
      if (isFieldMatch(file.fieldname)) {
        filteredFiles = request.file;
      } else {
        filteredFiles = null;
      }
    } else if (request.files && !Array.isArray(request.files)) {
      // Multer 'fields' mode returns an object keyed by field names
      const filesMap = request.files;
      const collected: Express.Multer.File[] = [];
      Object.entries(filesMap).forEach(([key, arr]) => {
        if (isFieldMatch(key) && Array.isArray(arr)) {
          collected.push(...arr);
        }
      });
      filteredFiles = collected.length > 0 ? collected : null;
    } else {
      filteredFiles = null;
    }
    if (Array.isArray(filteredFiles) && filteredFiles.length > 0) {
      for (const filteredFile of filteredFiles) {
        try {
          this.mimeTypeValidator.transform(filteredFile); // Validate MIME type
          this.sizeValidator.transform(filteredFile); // Validate file size
        } catch (error) {
          throw new BadRequestException(error);
        }
      }
      request.body[this.fileField] = filteredFiles as unknown;
    } else if (filteredFiles) {
      try {
        this.mimeTypeValidator.transform(filteredFiles);
        this.sizeValidator.transform(filteredFiles);
      } catch (error) {
        throw new BadRequestException(error);
      }
      request.body[this.fileField] = filteredFiles as unknown;
    }
    if (
      this.isRequired &&
      ((!Array.isArray(filteredFiles) && !filteredFiles) ||
        (Array.isArray(filteredFiles) && filteredFiles.length <= 0))
    ) {
      throw new BadRequestException(`${this.fileField} is required`);
    }

    return next.handle();
  }
}
