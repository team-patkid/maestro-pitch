import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode, ErrorMessage, ErrorStatus } from './enum/error.enum';

export class ServiceError extends HttpException {
  constructor(code: ErrorCode, error?: Error) {
    super(
      {
        message: ErrorMessage[code],
        code,
        error: error ? { cause: error } : {},
      },
      ErrorStatus[code],
    );
  }
}

export class HttpError extends HttpException {
  constructor(code: ErrorCode, status: HttpStatus) {
    super(
      {
        message: ErrorMessage[code],
        code,
      },
      status,
    );
  }
}
