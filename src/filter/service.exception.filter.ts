import { ArgumentsHost, Catch, HttpException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { ServiceError } from 'src/exception/service.error';
import { Response } from 'express';
import { ReportProvider } from 'src/log/reportProvider';

@Catch(ServiceError)
export class ServiceExceptionFilter extends BaseExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();
    const code = exception.getResponse()['code'];
    const message = exception.getResponse()['message'];
    const error = exception.getResponse()['error'];

    ReportProvider.reportWithLog({
      ctx: {
        message,
        code,
      },
      error,
      method: 'ServiceExceptionFilter',
    });

    response.status(exception.getStatus()).json({
      return: false,
      code,
      message,
    });
  }
}
