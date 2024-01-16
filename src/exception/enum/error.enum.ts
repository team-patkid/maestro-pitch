import { HttpStatus } from '@nestjs/common';

export enum ErrorCode {
  UNAUTHORIZED = 'Unauthorized',
}

export const ErrorMessage: { [key in ErrorCode]: string } = {
  [ErrorCode.UNAUTHORIZED]: 'Invalid Access Token',
};

export const ErrorStatus: { [key in ErrorCode]: HttpStatus } = {
  [ErrorCode.UNAUTHORIZED]: HttpStatus.UNAUTHORIZED,
};
