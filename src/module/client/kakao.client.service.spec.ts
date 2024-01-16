import Sinon, { SinonStubbedInstance } from 'sinon';
import { KakaoClientService } from './kakao.client.service';
import { v4 as uuidV4 } from 'uuid';
import { KakaoUserInfo } from './dto/kakao.client.dto';

describe('KakaoClientService', () => {
  let kakaoClientService: SinonStubbedInstance<KakaoClientService>;

  beforeEach(() => {
    kakaoClientService = Sinon.createStubInstance(KakaoClientService);
  });

  const createKakaoUserInfoDto = (ctx: {
    id?: number;
    expires_in?: number;
    app_id?: number;
  }): KakaoUserInfo => {
    return KakaoUserInfo.from(
      ctx.id ? ctx.id : 100,
      ctx.expires_in ? ctx.expires_in : 200,
      ctx.app_id ? ctx.app_id : 300,
    );
  };

  it('인증 토큰으로 kakao user 정보를 가져온다.', async () => {
    const token = uuidV4();

    kakaoClientService.getKakaoInfo
      .withArgs(token)
      .resolves(createKakaoUserInfoDto({}));

    // when
    const kakaoAuthInfo = await kakaoClientService.getKakaoInfo(token);

    expect(kakaoAuthInfo).toBeInstanceOf(KakaoUserInfo);
  });
});
