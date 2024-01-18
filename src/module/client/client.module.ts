import { Module, OnModuleInit } from '@nestjs/common';
import { KakaoClientService } from './kakao.client.service';
import { HttpModule, HttpService } from '@nestjs/axios';
import { CoreClientService } from './core.client.service';
import qs from 'qs';

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 10000,
        maxRedirects: 5,
        retries: 1,
        retryDelay: () => 50,
        paramsSerializer: (params) =>
          qs.stringify(params, { arrayFormat: 'repeat' }),
      }),
    }),
  ],
  providers: [CoreClientService, KakaoClientService],
  exports: [CoreClientService, KakaoClientService],
})
export class ClientModule implements OnModuleInit {
  constructor(private readonly httpService: HttpService) {}
  onModuleInit() {
    this.httpService.axiosRef.interceptors.request.use(
      (request) => request,
      (error) => {
        return error;
      },
    );

    this.httpService.axiosRef.interceptors.response.use(
      (response) => response,
      (error) => {
        return error;
      },
    );
  }
}
