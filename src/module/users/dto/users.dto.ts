import { ApiProperty } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { IsDefined, IsEnum, IsString } from 'class-validator';
import { UsersEntity } from 'src/repository/entity/users.entity';
import { TypeUsersSns } from 'src/repository/enum/users.repository.enum';

export class UsersLoginResult {
  userInfo: UsersEntity;
  jwt: string;

  static from(userInfo: UsersEntity, jwt: string): UsersLoginResult {
    return plainToInstance(UsersLoginResult, { userInfo, jwt });
  }
}

export class FindUserSnsInfoHandlerResponse {
  snsId: number;
  usersEntity?: UsersEntity;
}

export class PostUsersSnsLoginRequest {
  @ApiProperty({
    description: 'kakao auth info에서 나온 access_token',
  })
  @IsString()
  @IsDefined()
  token: string;

  @ApiProperty({
    description: 'SNS TYPE',
    example: 'kakao',
  })
  @IsEnum(TypeUsersSns)
  @IsDefined()
  snsType: TypeUsersSns;
}

export class PostUsersSnsLoginResponse {
  usersInfo: UsersEntity;
  jwt: string;
}
