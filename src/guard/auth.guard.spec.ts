import { createMock } from '@golevelup/ts-jest';
import { ExecutionContext } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import sinon, { SinonStubbedInstance } from 'sinon';
import { ConfigService } from 'src/config/config.service';
import { HttpError } from 'src/exception/service.error';
import { AuthService } from 'src/module/auth/auth.service';
import { UsersEntity } from 'src/repository/entity/users.entity';
import {
  TypeUsersGender,
  TypeUsersSns,
  TypeUsersStatus,
} from 'src/repository/enum/users.repository.enum';
import { UsersRepositoryService } from 'src/repository/service/users.repository.service';
import { v4 as uuidV4 } from 'uuid';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authService: AuthService;
  let usersRepositoryService: SinonStubbedInstance<UsersRepositoryService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: ConfigService.getConfig().JWT.SECRET,
        }),
      ],
    }).compile();

    authService = new AuthService(module.get<JwtService>(JwtService));
    usersRepositoryService = sinon.createStubInstance(UsersRepositoryService);
    guard = new AuthGuard(authService, usersRepositoryService);
  });

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

  describe('canActivate', () => {
    it('should throw an error if JWT is missing', async () => {
      const context = createMock<ExecutionContext>();
      context.switchToHttp().getRequest.mockReturnValue({
        headers: {},
      });

      // Act & Assert
      await expect(guard.canActivate(context)).rejects.toThrow(HttpError);
    });

    it('should throw an error if user is not normal', async () => {
      const context = createMock<ExecutionContext>();
      const userEntity = createUsersEntity({
        status: TypeUsersStatus.ASSOCIATE,
      });

      const jwt = await authService.getJwt(
        { ...userEntity },
        ConfigService.getConfig().JWT.LOGIN_EXPIRE_IN,
      );

      context.switchToHttp().getRequest.mockReturnValue({
        headers: { authorization: `Bearer ${jwt}` },
      });

      usersRepositoryService.findUsersInfoById.resolves(userEntity);

      // Act & Assert
      await expect(guard.canActivate(context)).rejects.toThrow(HttpError);
    });

    it('should set userEntity and token in request', async () => {
      const context = createMock<ExecutionContext>();
      const userEntity = createUsersEntity({
        status: TypeUsersStatus.NORMAL,
      });

      const jwt = await authService.getJwt(
        { ...userEntity },
        ConfigService.getConfig().JWT.LOGIN_EXPIRE_IN,
      );

      context.switchToHttp().getRequest.mockReturnValue({
        headers: { authorization: `Bearer ${jwt}` },
      });

      usersRepositoryService.findUsersInfoById.resolves(userEntity);

      // Act
      await guard.canActivate(context);

      // Assert
      expect(context.switchToHttp().getRequest()['userEntity']).toBe(
        userEntity,
      );

      expect(context.switchToHttp().getRequest()['token']).toBe(jwt);
    });

    it('should return true if all conditions are met', async () => {
      const context = createMock<ExecutionContext>();
      const userEntity = createUsersEntity({
        status: TypeUsersStatus.NORMAL,
      });

      const jwt = await authService.getJwt(
        { ...userEntity },
        ConfigService.getConfig().JWT.LOGIN_EXPIRE_IN,
      );

      context.switchToHttp().getRequest.mockReturnValue({
        headers: { authorization: `Bearer ${jwt}` },
      });

      usersRepositoryService.findUsersInfoById.resolves(userEntity);
      // Act
      const result = await guard.canActivate(context);

      // Assert
      expect(result).toBe(true);
    });
  });
});
