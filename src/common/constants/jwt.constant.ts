import { JwtSignOptions } from '@nestjs/jwt';

// Ensure `expiresIn` matches the expected type from NestJS JWT (number | StringValue)
const envExpiresIn = process.env.JWT_EXPIRES_IN;

export const jwtConstants: {
  secret: string;
  expiresIn: JwtSignOptions['expiresIn'];
} = {
  secret: process.env.JWT_SECRET || 'default_dev_secret',
  // Cast env value to the precise union type; default to a valid StringValue literal
  expiresIn: (envExpiresIn ?? '30d') as JwtSignOptions['expiresIn'],
};
