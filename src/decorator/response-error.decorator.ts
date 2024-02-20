import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import {
  ErrorCode,
  ErrorMessage,
  ErrorStatus,
} from 'src/exception/enum/error.enum';

/**
 * @param errorCodeList - Error code list
 * @returns - Error response decorator
 * @description - Error Status 에 따른 Error Response 를 반환하는 Decorator. schema 는 ErrorStatus 에 따라 다르게 반환한다.
 */
export const ResponseError = (errorCodeList: ErrorCode[]) =>
  applyDecorators(
    ...errorCodeList
      // status 추출
      .map((errorCode) => ErrorStatus[errorCode])
      .map((status) => {
        return ApiResponse({
          status: status,
          content: {
            'application/json': {
              schema: {
                oneOf: errorCodeList
                  // swagger는 status를 기준으로 중복 처리를 하기 때문에 status는 묶어주고 schema로 errorCode 및 errorMessage를 나눠준다.
                  .filter((errorCode) => ErrorStatus[errorCode] === status)
                  .map((errorCode) => {
                    return {
                      properties: {
                        result: {
                          type: 'boolean',
                          example: false,
                        },
                        errorCode: {
                          type: 'string',
                          example: errorCode,
                        },
                        errorMessage: {
                          type: 'string',
                          example: ErrorMessage[errorCode],
                        },
                      },
                    };
                  }),
              },
            },
          },
        });
      }),
  );
