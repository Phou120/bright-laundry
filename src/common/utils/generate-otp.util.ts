import { randomInt } from 'crypto';
import { EntityManager } from 'typeorm';
import { UserOrmEntity } from '../infrastructure/database/typeorms/entities/user.orm';

/**
 * Generate a numeric OTP of the specified length.
 * For length >= 2, returns a number with no leading zeros (e.g., 6 digits => 100000..999999).
 * For length === 1, returns 0..9.
 */

export async function generateUniqueNumericOtp(
  manager: EntityManager,
  length: number,
): Promise<string> {
  const repo = manager.getRepository(UserOrmEntity);

  // Keep generating until we find a unique OTP
  while (true) {
    const otp = generateNumericOtp(length);

    // Use findOne to check for existence of OTP
    const existingUser = await repo.findOne({
      where: { verify_otp: String(otp) },
    });

    if (!existingUser) {
      return otp;
    }
    // loop again to generate a new OTP
  }
}

function generateNumericOtp(length = 6): string {
  if (length <= 1) {
    return String(randomInt(0, 10));
  }
  const min = 10 ** (length - 1);
  const max = 10 ** length; // exclusive upper bound for randomInt
  return String(randomInt(min, max));
}
