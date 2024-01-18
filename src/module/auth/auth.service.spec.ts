import { HttpStatus } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtPayload } from 'jsonwebtoken';
import sinon, { SinonStubbedInstance } from 'sinon';
import { ConfigService } from 'src/config/config.service';
import { UsersEntity } from 'src/repository/entity/users.entity';
import {
  TypeUsersGender,
  TypeUsersSns,
  TypeUsersStatus,
} from 'src/repository/enum/users.repository.enum';
import { v4 as uuidV4 } from 'uuid';
import { CoreClientService } from '../client/core.client.service';
import { KakaoAuthInfo } from '../client/dto/kakao.client.dto';
import { KakaoClientService } from '../client/kakao.client.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  let kakaoClientService: KakaoClientService;
  let coreClientService: SinonStubbedInstance<CoreClientService>;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.registerAsync({
          useFactory: () => ({
            secret: ConfigService.getConfig().JWT.SECRET,
          }),
        }),
      ],
    }).compile();

    coreClientService = sinon.createStubInstance(CoreClientService);
    kakaoClientService = new KakaoClientService(coreClientService);
    jwtService = module.get(JwtService);
    authService = new AuthService(kakaoClientService, jwtService);
  });

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

  const createUsersEntity = (ctx: {
    email?: string;
    name?: string;
    contact?: string;
    experience?: number;
    gender?: TypeUsersGender;
    sns?: TypeUsersSns;
    status?: TypeUsersStatus;
    inputDate?: Date;
    updateDate?: Date;
    visitDate?: Date;
    kakaoPk?: number;
    comment?: string;
  }): UsersEntity => {
    const usersEntity = new UsersEntity();

    usersEntity.email = ctx.email ?? `${uuidV4()}@kakao.com`;
    usersEntity.name = ctx.email ?? uuidV4();
    usersEntity.contact = ctx.contact ?? uuidV4();
    usersEntity.experience = ctx.experience ?? 10;
    usersEntity.gender = ctx.gender ?? TypeUsersGender.MAN;
    usersEntity.sns = ctx.sns ?? TypeUsersSns.KAKAO;
    usersEntity.status = ctx.status ?? TypeUsersStatus.NORMAL;
    usersEntity.inputDate = ctx.inputDate ?? new Date();
    usersEntity.updateDate = ctx.updateDate ?? new Date();
    usersEntity.visitDate = ctx.visitDate ?? new Date();
    usersEntity.kakaoPk = ctx.kakaoPk ?? 172957;
    usersEntity.comment = ctx.comment ?? uuidV4();

    return usersEntity;
  };

  it('인가 코드 값으로 kakao user info 가져 오기', async () => {
    const code = uuidV4();
    const redirect = uuidV4();

    coreClientService.sendPostRequest.resolves({
      result: true,
      data: createKakaoAuthInfoDto({}),
      status: HttpStatus.OK,
    });

    const kakaoAuthInfo = await authService.getKakaoAuthInfo(code, redirect);

    expect(kakaoAuthInfo).toBeInstanceOf(KakaoAuthInfo);
  });

  it('jwt를 정상적으로 생성할 수 있다', async () => {
    const payload: JwtPayload = {
      foo: 'bar',
      bar: 'foo',
    };

    const jwt = await authService.getJwt(
      payload,
      ConfigService.getConfig().JWT.LOGIN_EXPIRE_IN,
    );

    expect(jwt.split('.').length).toBe(3);
  });

  it('jwt를 원하는 타입으로 decode 할 수 있다.', async () => {
    const email = 'foo@bar.com';

    const userEntity = createUsersEntity({ email });

    const jwt = await authService.getJwt(
      userEntity.toObject(),
      ConfigService.getConfig().JWT.LOGIN_EXPIRE_IN,
    );

    expect(jwt.split('.').length).toBe(3);

    const decodePayload = await authService.decodeJwt<UsersEntity>(jwt);

    expect(decodePayload.email).toBe(email);
  });
});
