import { randomBytes } from 'crypto';

export async function generateUniqueNo(
  length: number,
  checkUniqueness: (code: string) => Promise<boolean>,
  prefix?: string,
): Promise<string> {
  let isUnique = false;
  let code = '';
  let fullCode = '';

  while (!isUnique) {
    // Generate random alphanumeric code with the specified length
    code = generateRandomCode(length);

    // Add prefix if provided
    fullCode = prefix ? `${prefix}-${code}` : code;

    // Check uniqueness
    isUnique = !(await checkUniqueness(fullCode));
  }

  return fullCode;
}

/**
 * Generates a random alphanumeric code of specified length
 * @param length The length of the code to generate
 * @returns A random uppercase alphanumeric code
 */
function generateRandomCode(length: number): string {
  // Calculate how many bytes we need for the specified length
  // Each byte gives us 2 hex characters
  const bytesNeeded = Math.ceil(length / 2);

  return randomBytes(bytesNeeded)
    .toString('hex')
    .toUpperCase()
    .substring(0, length);
}
