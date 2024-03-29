import { Injectable } from '@nestjs/common';
import { ConfigService } from 'src/config/config.service';
import { ErrorCode } from 'src/exception/enum/error.enum';
import { ServiceError } from 'src/exception/service.error';
import { CoreClientService } from './core.client.service';
import { KakaoAuthInfo, KakaoUserInfo } from './dto/kakao.client.dto';

@Injectable()
export class KakaoClientService {
  private readonly AUTH_HOST = 'https://kauth.kakao.com';
  private readonly API_HOST = 'https://kapi.kakao.com';

  constructor(private readonly coreClientService: CoreClientService) {}

  async getKakaoUserInfo(token: string): Promise<KakaoUserInfo> {
    const response = await this.coreClientService.sendGetRequest<KakaoUserInfo>(
      `${this.API_HOST}/v1/user/access_token_info`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.result)
      throw new ServiceError(
        ErrorCode.KAKAO_CLIENT_ERROR,
        response.errorResponse,
      );

    return KakaoUserInfo.from(response.data);
  }

  async getKakaoAuthInfo(
    code: string,
    redirect: string,
  ): Promise<KakaoAuthInfo> {
    const response =
      await this.coreClientService.sendPostRequest<KakaoAuthInfo>(
        `${this.AUTH_HOST}/oauth/token`,
        {},
        {
          params: {
            grant_type: ConfigService.getConfig().SNS.KAKAO.GRANT_TYPE,
            client_id: ConfigService.getConfig().SNS.KAKAO.API,
            redirect_uri: redirect,
            code,
          },
          headers: {
            ['Content-type']: 'application/x-www-form-urlencoded;charset=utf-8',
          },
        },
      );

    if (!response.result)
      throw new ServiceError(
        ErrorCode.KAKAO_CLIENT_ERROR,
        response.errorResponse,
      );

    return KakaoAuthInfo.from(response.data);
  }
}
