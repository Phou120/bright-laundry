import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

/**
 * Accept times in HH:MM:SS 24-hour format (00:00:00 - 23:59:59)
 */
export const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/;

@ValidatorConstraint({ name: 'IsStartBeforeEnd', async: false })
export class IsStartBeforeEndConstraint
  implements ValidatorConstraintInterface
{
  validate(start_time: any, args: ValidationArguments) {
    const obj = args.object as any;
    const end_time = obj?.end_time;

    // If either is missing or not a string, let other validators handle it
    if (typeof start_time !== 'string' || typeof end_time !== 'string')
      return true;

    // If formats are invalid, let Matches validators report the errors
    if (!TIME_REGEX.test(start_time) || !TIME_REGEX.test(end_time)) return true;

    const toSeconds = (t: string) => {
      const [h, m, s] = t.split(':').map(Number);
      return h * 3600 + m * 60 + s;
    };

    return toSeconds(start_time) < toSeconds(end_time);
  }

  defaultMessage(args: ValidationArguments) {
    return 'start_time must be strictly before end_time';
  }
}
