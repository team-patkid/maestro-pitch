import { HttpService } from '@nestjs/axios';
import { HttpStatus } from '@nestjs/common';
import { AxiosRequestConfig } from 'axios';
import { catchError, lastValueFrom, retry } from 'rxjs';
import { LogProvider } from 'src/log/logProvider';

export class CoreClientService {
  constructor(private readonly httpService: HttpService) {}

  async sendGetRequest<T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<{
    result: boolean;
    data: T;
    status: number;
    errorResponse?: any;
  }> {
    const response = this.httpService.get(url, config).pipe(
      retry(5),
      catchError((error: any) => {
        LogProvider.error(
          {
            error,
          },
          `sendGetRequest: Path(${url})`,
        );

        throw {
          result: false,
          data: null,
          status: error.response.status,
          errorResponse: error.response,
        };
      }),
    );

    const { data } = await lastValueFrom(response);

    return {
      result: true,
      data,
      status: HttpStatus.OK,
    };
  }

  async sendPostRequest<T>(
    url: string,
    body: Record<string, any>,
    config?: AxiosRequestConfig,
  ): Promise<{
    result: boolean;
    data: T;
    status: number;
    errorResponse?: any;
  }> {
    const response = this.httpService.post(url, body, config).pipe(
      retry(5),
      catchError((error: any) => {
        LogProvider.error(
          {
            error,
          },
          `sendPostRequest: Path(${url})`,
        );

        throw {
          result: false,
          data: null,
          status: error.response.status,
          errorResponse: error.response,
        };
      }),
    );

    const { data } = await lastValueFrom(response);

    LogProvider.info(
      {
        data,
      },
      `sendPostRequest: Path(${url})`,
    );

    return {
      result: true,
      data,
      status: HttpStatus.OK,
    };
  }
}
