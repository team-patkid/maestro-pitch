import { ArgumentsHost, Catch, HttpException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { ServiceError } from 'src/exception/service.error';
import { Response } from 'express';

@Catch(ServiceError)
export class ServiceExceptionFilter extends BaseExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();

    response.status(exception.getStatus()).json({
      return: false,
      code: exception.getResponse()['code'],
      message: exception.getResponse()['message'],
    });
  }
}
