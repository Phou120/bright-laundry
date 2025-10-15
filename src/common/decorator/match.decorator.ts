import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

/**
 * Custom decorator to ensure a property's value matches the value of another property.
 * Example: Used for confirming passwords.
 *
 * @param property The name of the property to compare against (e.g., 'password').
 * @param validationOptions Optional class-validator options.
 */
export function Match(property: string, validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'Match',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          // Get the value of the property being compared against
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];

          // Return true if values match
          return value === relatedValue;
        },
        defaultMessage(args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          // You can use your i18n helper here if preferred, e.g.:
          // return i18nValidationMessage('validation.PASSWORDS_NOT_MATCH');
          return `${propertyName} must match ${relatedPropertyName} exactly`;
        },
      },
    });
  };
}
