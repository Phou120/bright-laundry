import { ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Timezone } from '@src/common/value-objects/timezone.vo';
import { ValidationError } from 'class-validator';
import moment from 'moment-timezone';
import {
  I18nValidationException,
  I18nValidationExceptionFilter,
} from 'nestjs-i18n';

export class CustomI18nValidationExceptionFilter extends I18nValidationExceptionFilter {
  constructor() {
    super({
      detailedErrors: true,
      errorFormatter: (errors: ValidationError[]): object => {
        return errors;
      },
      responseBodyFormatter: (
        host: ArgumentsHost,
        exc: I18nValidationException,
        formattedErrors: object,
      ): Record<string, unknown> => {
        const ctx = host.switchToHttp();
        const request = ctx.getRequest();
        const errors = formattedErrors as ValidationError[];
        const customError: Record<string, string[]> = {};

        const processValidationError = (
          error: ValidationError,
          parentPath = '',
        ): void => {
          const currentPath = parentPath
            ? `${parentPath}.${error.property}`
            : error.property;

          // Handle array validation for approval_rules
          if (error.property === 'approval_rules') {
            if (!error.value || error.value.length === 0) {
              customError[currentPath] = ['ກະລຸນາເພີ່ມຢ່າງໜ້ອຍ 1 ລາຍການ'];
              return;
            }
          }

          // Handle direct constraints
          if (error.constraints) {
            customError[currentPath] = Object.values(error.constraints);
          }

          // Handle array validation
          if (error.children && error.children.length > 0) {
            const isArrayValidation = error.children?.some(
              (child) => !isNaN(Number(child.property)),
            );

            if (isArrayValidation) {
              error.children?.forEach((child) => {
                const arrayPath = `${currentPath}[${child.property}]`;

                // Add validation for empty array items
                if (!child.value || Object.keys(child.value).length === 0) {
                  customError[arrayPath] = ['ກະລຸນາປ້ອນຂໍ້ມູນໃຫ້ຄົບຖ້ວນ'];
                }

                if (child.constraints) {
                  customError[arrayPath] = Object.values(child.constraints);
                }

                // Process nested properties
                if (child.children?.length) {
                  child.children.forEach(
                    (nestedChild: ValidationError): void => {
                      processValidationError(nestedChild, arrayPath);
                    },
                  );
                }
              });
            } else {
              error.children?.forEach((child) => {
                processValidationError(child, currentPath);
              });
            }
          }
        };

        // Process all errors
        errors.forEach((error) => processValidationError(error));

        // Remove empty arrays from errors
        Object.keys(customError).forEach((key) => {
          if (
            Array.isArray(customError[key]) &&
            customError[key].length === 0
          ) {
            delete customError[key];
          }
        });

        return {
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          timestamp: moment.tz(Timezone.LAOS).format('DD-MM-YYYY HH:mm:ss'),
          path: request.url,
          method: request.method,
          message: 'ຂໍ້ມູນບໍ່ຖືກຕ້ອງ ກະລຸນາກວດສອບ',
          errors: customError,
        };
      },
    });
  }
}
