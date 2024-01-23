import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ConfigService } from 'src/config/config.service';
import { UsersEntity } from 'src/repository/entity/users.entity';
import { TypeUsersSns } from 'src/repository/enum/users.repository.enum';
import { UsersRepositoryService } from 'src/repository/service/users.repository.service';
import { AuthService } from '../auth/auth.service';
import { KakaoClientService } from '../client/kakao.client.service';
import {
  FindUserSnsInfoHandlerResponse,
  UsersLoginResult,
} from './dto/users.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepositoryService: UsersRepositoryService,
    private readonly authService: AuthService,
    private readonly kakaoClientService: KakaoClientService,
  ) {}

  async oauthLogin(
    usersSnsType: TypeUsersSns,
    token: string,
  ): Promise<UsersLoginResult> {
    const snsInfo = await this.findUserSnsInfoHandler(usersSnsType, token);

    if (!snsInfo.usersEntity) {
      snsInfo.usersEntity = await this.usersRepositoryService.upsertUserInfo(
        plainToInstance(UsersEntity, {
          kakaoPk: snsInfo.snsId,
          sns: usersSnsType,
        }),
      );
    }

    const jwt = await this.authService.getJwt(
      { ...snsInfo.usersEntity },
      ConfigService.getConfig().JWT.LOGIN_EXPIRE_IN,
    );

    return UsersLoginResult.from(snsInfo.usersEntity, jwt);
  }

  async findUserSnsInfoHandler(
    usersSnsType: TypeUsersSns,
    token: string,
  ): Promise<FindUserSnsInfoHandlerResponse> {
    let id: number;
    let usersEntity: UsersEntity;

    switch (usersSnsType) {
      case TypeUsersSns.KAKAO: {
        id = (await this.kakaoClientService.getKakaoUserInfo(token)).id;
        usersEntity = await this.usersRepositoryService.findUsersInfo(
          plainToInstance(UsersEntity, { kakaoPk: id }),
        );
      }
      default:
        break;
    }

    return { snsId: id, usersEntity };
  }
}
