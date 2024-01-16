import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { catchError, lastValueFrom, retry } from 'rxjs';
import { ReportProvider } from 'src/log/reportProvider';
import { KakaoUserInfo } from './dto/kakao.client.dto';

@Injectable()
export class KakaoClientService {
  private readonly AUTH_HOST = 'https://kauth.kakao.com';
  private readonly API_HOST = 'https://kapi.kakao.com';

  constructor(private readonly httpService: HttpService) {}

  async getKakaoInfo(token: string): Promise<KakaoUserInfo> {
    const response = this.httpService
      .get(`${this.API_HOST}/v1/user/access_token_info`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .pipe(
        retry(5),
        catchError((error: any) => {
          ReportProvider.report({
            error,
            method: 'KakaoClientService.getKakaoInfo',
          });

          throw error;
        }),
      );

    const { data } = await lastValueFrom(response);

    return KakaoUserInfo.from(data.id, data.expires_in, data.app_id);
  }
}
