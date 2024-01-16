import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import sinon, { SinonStubbedInstance } from 'sinon';
import { Repository } from 'typeorm';

describe('AuthService', () => {
  let service: AuthService;
  let kakaoApiClientService: SinonStubbedInstance<KakaoApiClientService>;
  let userRepository: Repository<UserEntity>;
  let userRepositoryService: SinonStubbedInstance<UserRepositoryService>;

  beforeEach(async () => {
    kakaoApiClientService = sinon.createStubInstance(KakaoApiClientService);
    userRepositoryService = sinon.createStubInstance(UserRepositoryService);

    service = new AuthService(kakaoApiClientService, userRepositoryService);
  });

  const createGetKakaoInfoRequestDto(ctx: {
    code?: string,
    redirect?: string,
  }): GetKakaoInfoRequestDto {

  }

  it('code 값과 redirect 값으로 토큰을 response 한다.', async () => {
    await service.getKakaoInfo()
  });
});
