import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtPayload } from 'jsonwebtoken';
import { ConfigService } from 'src/config/config.service';
import { UsersEntity } from 'src/repository/entity/users.entity';
import {
  TypeUsersGender,
  TypeUsersSns,
  TypeUsersStatus,
} from 'src/repository/enum/users.repository.enum';
import { v4 as uuidV4 } from 'uuid';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;
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

    jwtService = module.get(JwtService);

    authService = new AuthService(jwtService);
  });

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

  describe('Auth Service', () => {
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
        { ...userEntity },
        ConfigService.getConfig().JWT.LOGIN_EXPIRE_IN,
      );

      expect(jwt.split('.').length).toBe(3);

      const decodePayload = await authService.decodeJwt<UsersEntity>(jwt);

      expect(decodePayload.email).toBe(email);
    });
  });
});
