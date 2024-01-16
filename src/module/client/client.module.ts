import { Module, OnModuleInit } from '@nestjs/common';
import { KakaoClientService } from './kakao.client.service';
import { HttpModule, HttpService } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 10000,
        maxRedirects: 5,
      }),
    }),
  ],
  providers: [KakaoClientService],
  exports: [KakaoClientService],
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
