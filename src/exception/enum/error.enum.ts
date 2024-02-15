import { HttpStatus } from '@nestjs/common';

export enum ErrorCode {
  UNAUTHORIZED = 'unauthorized',
  JWT_UNABLE_VERIFY = 'jwt_unable_verify',
  NOT_FOUND_CONTENT = 'not_found_content',
  KAKAO_CLIENT_ERROR = 'kakao_client_error',
  NOT_ASSOCIATE_USER = 'not_asssociate_user',
}

export const ErrorMessage: { [key in ErrorCode]: string } = {
  [ErrorCode.UNAUTHORIZED]: 'Invalid Access Token',
  [ErrorCode.JWT_UNABLE_VERIFY]: 'Unable verify of jwt',
  [ErrorCode.NOT_FOUND_CONTENT]: 'Not found content',
  [ErrorCode.KAKAO_CLIENT_ERROR]: 'Kakao client error',
  [ErrorCode.NOT_ASSOCIATE_USER]: 'Not associate user',
};

export const ErrorStatus: { [key in ErrorCode]: HttpStatus } = {
  [ErrorCode.UNAUTHORIZED]: HttpStatus.UNAUTHORIZED,
  [ErrorCode.JWT_UNABLE_VERIFY]: HttpStatus.UNAUTHORIZED,
  [ErrorCode.NOT_FOUND_CONTENT]: HttpStatus.NOT_FOUND,
  [ErrorCode.KAKAO_CLIENT_ERROR]: HttpStatus.INTERNAL_SERVER_ERROR,
  [ErrorCode.NOT_ASSOCIATE_USER]: HttpStatus.UNAUTHORIZED,
};
