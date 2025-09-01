export interface OTPEmailContext {
  otp: string;
  email?: string;
  expiresInMinutes?: number;
  currentYear?: number;
  url?: string;
}
