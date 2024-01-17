import Sinon, { SinonStubbedInstance } from 'sinon';
import { KakaoClientService } from './kakao.client.service';
import { v4 as uuidV4 } from 'uuid';
import { KakaoAuthInfo, KakaoUserInfo } from './dto/kakao.client.dto';
import { CoreClientService } from './core.client.service';
import { HttpStatus } from '@nestjs/common';
import moment from 'moment';

describe('KakaoClientService', () => {
  let kakaoClientService: KakaoClientService;
  let coreClientService: SinonStubbedInstance<CoreClientService>;

  beforeEach(() => {
    coreClientService = Sinon.createStubInstance(CoreClientService);
    kakaoClientService = new KakaoClientService(coreClientService);
  });

  const createKakaoUserInfoDto = (ctx: {
    id?: number;
    expires_in?: number;
    app_id?: number;
  }): KakaoUserInfo => {
    return KakaoUserInfo.from({
      id: ctx.id ? ctx.id : 100,
      expires_in: ctx.expires_in ? ctx.expires_in : 200,
      app_id: ctx.app_id ? ctx.app_id : 300,
    });
  };

  const createKakaoAuthInfoDto = (ctx: {
    access_token?: string;
    token_type?: string;
    refresh_token?: string;
    expires_in?: number;
    refresh_token_expires_in?: number;
  }): KakaoAuthInfo => {
    const kakaoAuthTokenDto = KakaoAuthInfo.from({
      access_token: ctx.access_token ? ctx.access_token : uuidV4(),
      expires_in: ctx.expires_in ? ctx.expires_in : 123456,
      refresh_token: ctx.refresh_token ? ctx.refresh_token : uuidV4(),
      refresh_token_expires_in: ctx.refresh_token_expires_in
        ? ctx.refresh_token_expires_in
        : 654321,
      token_type: ctx.token_type ? ctx.token_type : 'NORMAL',
    });

    return kakaoAuthTokenDto;
  };

  it('인증 토큰으로 kakao user 정보를 가져온다.', async () => {
    const token = uuidV4();

    coreClientService.sendGetRequest.resolves({
      result: true,
      data: createKakaoUserInfoDto({}),
      status: HttpStatus.OK,
    });

    // when
    const kakaoUserInfo = await kakaoClientService.getKakaoUserInfo(token);

    expect(kakaoUserInfo).toBeInstanceOf(KakaoUserInfo);
  });

  it('클라이언트에서 받은 code값과 redirect url로 인증 토큰을 가져 온다', async () => {
    const code = uuidV4();
    const redirect = uuidV4();

    coreClientService.sendPostRequest.resolves({
      result: true,
      data: createKakaoAuthInfoDto({}),
      status: HttpStatus.OK,
    });

    const kakaoAuthInfo = await kakaoClientService.getKakaoAuthInfo(
      code,
      redirect,
    );

    expect(kakaoAuthInfo).toBeInstanceOf(KakaoAuthInfo);
  });
});
