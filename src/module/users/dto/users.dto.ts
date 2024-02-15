import { ApiProperty } from '@nestjs/swagger';
import { plainToClass, plainToInstance } from 'class-transformer';
import { IsDefined, IsEmail, IsEnum, IsString } from 'class-validator';
import { UsersEntity } from 'src/repository/entity/users.entity';
import {
  TypeUsersGender,
  TypeUsersSns,
} from 'src/repository/enum/users.repository.enum';

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

export class PatchNormalUserResponse {
  @ApiProperty({
    description: '정회원 인증 후 나온 jwt token',
  })
  @IsString()
  @IsDefined()
  jwt: string;
}

export class PostUsersSnsLoginResponse {
  usersInfo: UsersEntity;
  jwt: string;
}

export class PatchNormalUserRequest {
  @ApiProperty({
    description: '사용할 email',
  })
  @IsEmail()
  @IsDefined()
  email: string;

  @ApiProperty({
    description: '유저 이름',
  })
  @IsString()
  @IsDefined()
  name: string;

  @ApiProperty({
    description: '전화번호',
  })
  @IsString()
  @IsDefined()
  contact: string;

  @ApiProperty({
    description: '성별',
  })
  @IsEnum(TypeUsersGender)
  @IsDefined()
  gender: TypeUsersGender;
}

export class NormalUserDto {
  email: string;
  name: string;
  contact: string;
  gender: TypeUsersGender;

  static from(ctx: {
    email: string;
    name: string;
    contact: string;
    gender: TypeUsersGender;
  }): NormalUserDto {
    return plainToClass(NormalUserDto, ctx);
  }
}
