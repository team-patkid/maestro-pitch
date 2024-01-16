import { HttpException } from '@nestjs/common';
import { ErrorCode, ErrorMessage, ErrorStatus } from './enum/error.enum';

export class ServiceError extends HttpException {
  constructor(code: ErrorCode, error?: Error) {
    super(
      {
        message: ErrorMessage[code],
        code,
      },
      ErrorStatus[code],
      error ? { cause: error } : {},
    );
  }
}
