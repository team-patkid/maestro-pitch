import { HttpStatus } from '@nestjs/common';

export enum ErrorCode {
  UNAUTHORIZED = 'Unauthorized',
  JWT_UNABLE_VERIFY = 'Jwt unable verify',
  NOT_FOUND_CONTENT = 'Not found content',
}

export const ErrorMessage: { [key in ErrorCode]: string } = {
  [ErrorCode.UNAUTHORIZED]: 'Invalid Access Token',
  [ErrorCode.JWT_UNABLE_VERIFY]: 'Unable verify of jwt',
  [ErrorCode.NOT_FOUND_CONTENT]: 'Not found content',
};

export const ErrorStatus: { [key in ErrorCode]: HttpStatus } = {
  [ErrorCode.UNAUTHORIZED]: HttpStatus.UNAUTHORIZED,
  [ErrorCode.JWT_UNABLE_VERIFY]: HttpStatus.UNAUTHORIZED,
  [ErrorCode.NOT_FOUND_CONTENT]: HttpStatus.NOT_FOUND,
};
