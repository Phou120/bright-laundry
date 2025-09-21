import { HttpStatus } from '@nestjs/common';
import { DomainException } from '../exceptions/domain.exception';

export async function generateUniqueCode(
  prefix: string,
  checkExistsFn: (code: string) => Promise<boolean>,
  min: number,
  max: number,
): Promise<string> {
  for (let i = min; i <= max; i++) {
    const code = `${prefix}-${i.toString().padStart(max, '0')}`;
    if (!(await checkExistsFn(code))) {
      return code;
    }
  }
  throw new DomainException('errors.code_exists', HttpStatus.CONFLICT);
}
