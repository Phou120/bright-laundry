export const jwtConstants = {
  secret: process.env.JWT_SECRET || 'default_dev_secret',
  expiresIn: process.env.JWT_EXPIRES_IN || '30d',
};
