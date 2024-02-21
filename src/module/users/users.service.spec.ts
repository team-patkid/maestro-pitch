import { HttpStatus } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import sinon, { SinonStubbedInstance } from 'sinon';
import { ConfigService } from 'src/config/config.service';
import { UsersEntity } from 'src/repository/entity/users.entity';
import {
  TypeUsersGender,
  TypeUsersSns,
  TypeUsersStatus,
} from 'src/repository/enum/users.repository.enum';
import { LogExperienceRepositoryService } from 'src/repository/service/log-experience.repository.service';
import { UsersRepositoryService } from 'src/repository/service/users.repository.service';
import { v4 as uuidV4 } from 'uuid';
import { AuthService } from '../auth/auth.service';
import { CoreClientService } from '../client/core.client.service';
import { KakaoUserInfo } from '../client/dto/kakao.client.dto';
import { KakaoClientService } from '../client/kakao.client.service';
import { NormalUserDto, UsersLoginResult } from './dto/users.dto';
import { UsersService } from './users.service';
import { AddressRepositoryService } from 'src/repository/service/address.repository.service';

describe('UsersService', () => {
  let usersService: UsersService;
  let authService: AuthService;
  let usersRepositoryService: SinonStubbedInstance<UsersRepositoryService>;
  let coreClientService: SinonStubbedInstance<CoreClientService>;
  let kakaoClientService: KakaoClientService;
  let logExperienceRepositoryService: SinonStubbedInstance<LogExperienceRepositoryService>;
  let addressRepositoryService: SinonStubbedInstance<AddressRepositoryService>;

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
    const jwtService = module.get<JwtService>(JwtService);

    authService = new AuthService(jwtService);

    coreClientService = sinon.createStubInstance(CoreClientService);
    usersRepositoryService = sinon.createStubInstance(UsersRepositoryService);
    kakaoClientService = new KakaoClientService(coreClientService);
    logExperienceRepositoryService = sinon.createStubInstance(
      LogExperienceRepositoryService,
    );
    addressRepositoryService = sinon.createStubInstance(
      AddressRepositoryService,
    );

    usersService = new UsersService(
      usersRepositoryService,
      authService,
      kakaoClientService,
      logExperienceRepositoryService,
      addressRepositoryService,
    );
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

  const createUsersEntity = (ctx: {
    id?: number;
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
    kakaoPk?: string;
    comment?: string;
  }): UsersEntity => {
    const usersEntity = new UsersEntity();

    usersEntity.id = ctx.id ?? 100;
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
    usersEntity.kakaoPk = ctx.kakaoPk ?? uuidV4();
    usersEntity.comment = ctx.comment ?? uuidV4();

    return usersEntity;
  };

  const createNormalUserDto = (ctx: {
    email?: string;
    name?: string;
    contact?: string;
    gender?: TypeUsersGender;
  }): NormalUserDto => {
    const dto = new NormalUserDto();

    dto.email = ctx.email ?? 'foo@bar.com';
    dto.name = ctx.name ?? uuidV4();
    dto.contact = ctx.contact ?? uuidV4();
    dto.gender = ctx.gender ?? TypeUsersGender.MAN;

    return dto;
  };

  it('kakao 로그인으로 간편 회원가입이 가능하다.', async () => {
    // Ready
    const id = 20000;
    const email = 'foo@bar.com';
    const token = uuidV4();
    const typeUsersSns = TypeUsersSns.KAKAO;

    coreClientService.sendGetRequest
      .withArgs(
        sinon.match((value: string) =>
          value.includes('/v1/user/access_token_info'),
        ),
      )
      .resolves({
        data: createKakaoUserInfoDto({ id }),
        result: true,
        status: HttpStatus.OK,
      });

    usersRepositoryService.findUsersInfoById.resolves(null);

    usersRepositoryService.insertUserInfo.resolves(
      createUsersEntity({ email }),
    );

    logExperienceRepositoryService.findLoginExperienceInToday.resolves(null);

    logExperienceRepositoryService.insertLogExperience.resolves(null);

    usersRepositoryService.updateUserInfo.resolves(
      createUsersEntity({ email, id }),
    );

    // When
    const signUpResult: UsersLoginResult = await usersService.oauthLogin(
      typeUsersSns,
      token,
    );

    const decodeJwt = await authService.decodeJwt<UsersEntity>(
      signUpResult.jwt,
    );

    // Then
    expect(decodeJwt.id).toBe(id);
  });

  it('kakao 로그인 후 회원가입이 되어 있다면 있는 정보를 JWT 로 반환한다.', async () => {
    const id = 20000;
    const email = 'foo@bar.com';
    const emailInDb = 'bar@foo.com';

    coreClientService.sendGetRequest
      .withArgs(
        sinon.match((value: string) =>
          value.includes('/v1/user/access_token_info'),
        ),
      )
      .resolves({
        data: createKakaoUserInfoDto({ id }),
        result: true,
        status: HttpStatus.OK,
      });

    usersRepositoryService.updateUserInfo.resolves(
      createUsersEntity({ id, email: emailInDb }),
    );

    usersRepositoryService.findUsersInfoByKakaoPk.resolves(
      createUsersEntity({ email: emailInDb }),
    );

    logExperienceRepositoryService.findLoginExperienceInToday.resolves(null);

    logExperienceRepositoryService.insertLogExperience.resolves(null);

    const token = uuidV4();
    const typeUsersSns = TypeUsersSns.KAKAO;

    const signUpResult: UsersLoginResult = await usersService.oauthLogin(
      typeUsersSns,
      token,
    );

    const decodeJwt = await authService.decodeJwt<UsersEntity>(
      signUpResult.jwt,
    );

    expect(decodeJwt.id).toBe(id);
  });

  it('미인증 유저는 추가 정보를 통해 정회원으로 가입 한다', async () => {
    const dto = createNormalUserDto({});
    const id = 1;
    const address = ['서울', '강남'];

    // Ready
    usersRepositoryService.updateUserInfo.resolves(
      createUsersEntity({ status: TypeUsersStatus.NORMAL }),
    );

    // When
    const response = await usersService.patchNormalUserAndGetNormalJwt(
      id,
      dto,
      address,
    );

    // Then
    const payload = await authService.decodeJwt<UsersEntity>(response);

    expect(payload.status).toBe(TypeUsersStatus.NORMAL);
  });
});
