import { Injectable } from '@nestjs/common';
import { plainToClass, plainToInstance } from 'class-transformer';
import { ConfigService } from 'src/config/config.service';
import { TransactionalExceptTest } from 'src/decorator/transactional-except-test';
import { UsersEntity } from 'src/repository/entity/users.entity';
import {
  TypeUsersSns,
  TypeUsersStatus,
} from 'src/repository/enum/users.repository.enum';
import { LogExperienceRepositoryService } from 'src/repository/service/log-experience.repository.service';
import { UsersRepositoryService } from 'src/repository/service/users.repository.service';
import { AuthService } from '../auth/auth.service';
import { KakaoClientService } from '../client/kakao.client.service';
import {
  FindUserSnsInfoHandlerResponse,
  NormalUserDto,
  UsersLoginResult,
} from './dto/users.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepositoryService: UsersRepositoryService,
    private readonly authService: AuthService,
    private readonly kakaoClientService: KakaoClientService,
    private readonly logExperienceRepositoryService: LogExperienceRepositoryService,
  ) {}

  @TransactionalExceptTest()
  async oauthLogin(
    usersSnsType: TypeUsersSns,
    token: string,
  ): Promise<UsersLoginResult> {
    const snsInfo = await this.findUserSnsInfoHandler(usersSnsType, token);

    await this.logExperienceRepositoryService.insertLoginExperienceUntilToday(
      snsInfo.usersEntity.id,
    );

    const userInfo = await this.usersRepositoryService.updateUserInfo(
      plainToInstance(UsersEntity, { id: snsInfo.usersEntity.id }),
      plainToInstance(UsersEntity, { visitDate: new Date() }),
    );

    const jwt = await this.authService.getJwt(
      { ...userInfo },
      ConfigService.getConfig().JWT.LOGIN_EXPIRE_IN,
    );

    return UsersLoginResult.from(userInfo, jwt);
  }

  async findUserSnsInfoHandler(
    usersSnsType: TypeUsersSns,
    token: string,
  ): Promise<FindUserSnsInfoHandlerResponse> {
    let id: number;
    let usersEntity: UsersEntity | null;

    switch (usersSnsType) {
      case TypeUsersSns.KAKAO:
        {
          id = (await this.kakaoClientService.getKakaoUserInfo(token)).id;
          usersEntity = await this.usersRepositoryService.findUsersInfo(
            plainToInstance(UsersEntity, { kakaoPk: id }),
          );

          if (!usersEntity) {
            usersEntity = await this.usersRepositoryService.insertUserInfo(
              plainToInstance(UsersEntity, {
                kakaoPk: id,
                sns: usersSnsType,
                visitDate: new Date(),
              }),
            );
          }
        }
        break;
      default:
        break;
    }
    return { snsId: id, usersEntity };
  }

  async patchNormalUserAndGetNormalJwt(
    id: number,
    dto: NormalUserDto,
  ): Promise<string> {
    const normalUserInfo = await this.usersRepositoryService.updateUserInfo(
      plainToClass(UsersEntity, { id }),
      plainToClass(UsersEntity, { ...dto, status: TypeUsersStatus.NORMAL }),
    );

    const jwt = await this.authService.getJwt(
      { ...normalUserInfo },
      ConfigService.getConfig().JWT.LOGIN_EXPIRE_IN,
    );

    return jwt;
  }
}
