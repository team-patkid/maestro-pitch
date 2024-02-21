import { Injectable } from '@nestjs/common';
import { plainToClass, plainToInstance } from 'class-transformer';
import { ConfigService } from 'src/config/config.service';
import { TransactionalExceptTest } from 'src/decorator/transactional-except-test';
import { AddressEntity } from 'src/repository/entity/address.entity';
import { UsersEntity } from 'src/repository/entity/users.entity';
import {
  TypeUsersSns,
  TypeUsersStatus,
} from 'src/repository/enum/users.repository.enum';
import { AddressRepositoryService } from 'src/repository/service/address.repository.service';
import { LogExperienceRepositoryService } from 'src/repository/service/log-experience.repository.service';
import { UsersRepositoryService } from 'src/repository/service/users.repository.service';
import { AuthService } from '../auth/auth.service';
import { KakaoClientService } from '../client/kakao.client.service';
import { NormalUserDto, UsersLoginResult } from './dto/users.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepositoryService: UsersRepositoryService,
    private readonly authService: AuthService,
    private readonly kakaoClientService: KakaoClientService,
    private readonly logExperienceRepositoryService: LogExperienceRepositoryService,
    private readonly addressRepositoryService: AddressRepositoryService,
  ) {}

  @TransactionalExceptTest()
  async oauthLogin(
    usersSnsType: TypeUsersSns,
    token: string,
  ): Promise<UsersLoginResult> {
    const usersEntity = await this.getUserEntityBySnsType(usersSnsType, token);
    await this.logExperienceRepositoryService.insertLoginExperienceUntilToday(
      usersEntity.id,
    );

    const userInfo = await this.usersRepositoryService.updateUserInfo(
      plainToInstance(UsersEntity, { id: usersEntity.id }),
      plainToInstance(UsersEntity, { visitDate: new Date() }),
    );

    const jwt = await this.authService.getJwt(
      { id: userInfo.id, status: userInfo.status },
      ConfigService.getConfig().JWT.LOGIN_EXPIRE_IN,
    );

    return UsersLoginResult.from(userInfo, jwt);
  }

  async getUserEntityBySnsType(
    usersSnsType: TypeUsersSns,
    token: string,
  ): Promise<UsersEntity> {
    let usersEntity: UsersEntity;

    switch (usersSnsType) {
      case TypeUsersSns.KAKAO:
        usersEntity = await this.getUserEntityOfKakao(token);
        break;
      default:
        break;
    }
    return usersEntity;
  }

  async getUserEntityOfKakao(token: string): Promise<UsersEntity> {
    const kakaoPk = (await this.kakaoClientService.getKakaoUserInfo(token))
      .kakaoPk;
    let usersEntity = await this.usersRepositoryService.findUsersInfoByKakaoPk(
      kakaoPk,
    );

    if (!usersEntity) {
      usersEntity = await this.usersRepositoryService.insertUserInfo(
        plainToInstance(UsersEntity, {
          kakaoPk: kakaoPk,
          sns: TypeUsersSns.KAKAO,
          visitDate: new Date(),
        }),
      );
    }

    return usersEntity;
  }

  @TransactionalExceptTest()
  async patchNormalUserAndGetNormalJwt(
    id: number,
    dto: NormalUserDto,
    address: Array<string>,
  ): Promise<string> {
    await this.addressRepositoryService.bulkInsertAddressInfo(
      address.map((address) =>
        plainToClass(AddressEntity, {
          address,
          userId: id,
        }),
      ),
    );

    const userInfo = await this.usersRepositoryService.updateUserInfo(
      plainToClass(UsersEntity, { id }),
      plainToClass(UsersEntity, { ...dto, status: TypeUsersStatus.NORMAL }),
    );

    const jwt = await this.authService.getJwt(
      { id, status: userInfo.status },
      ConfigService.getConfig().JWT.LOGIN_EXPIRE_IN,
    );

    return jwt;
  }
}
