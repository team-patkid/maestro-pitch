import { ApiProperty } from '@nestjs/swagger';
import { Type, plainToClass, plainToInstance } from 'class-transformer';
import {
  IsArray,
  IsDefined,
  IsEmail,
  IsEnum,
  IsNumber,
  IsString,
} from 'class-validator';
import { UsersEntity } from 'src/repository/entity/users.entity';
import {
  TypeUsersGender,
  TypeUsersSns,
  TypeUsersStatus,
} from 'src/repository/enum/users.repository.enum';

export class UsersLoginResult {
  userInfo: UsersEntity;
  jwt: string;

  static from(userInfo: UsersEntity, jwt: string): UsersLoginResult {
    return plainToInstance(UsersLoginResult, { userInfo, jwt });
  }
}

export class PostUsersSnsLoginRequest {
  @ApiProperty({
    description: '/v1/auth/kakao response 값 access_token',
    example:
      'N6kmZd-APXjHUmxKnN4ljrMaTEdARaBq5U9anMUcrNfgwLx_aLfukvJBju4KKiVRAAABjRV-SVsh5oEAb4_jFQ',
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
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
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
    example: 'foo@bar.com',
  })
  @IsEmail()
  @IsDefined()
  email: string;

  @ApiProperty({
    description: '유저 이름',
    example: '홍길동',
  })
  @IsString()
  @IsDefined()
  name: string;

  @ApiProperty({
    description: '전화번호',
    example: '010-1234-5678',
  })
  @IsString()
  @IsDefined()
  contact: string;

  @ApiProperty({
    description: '성별',
    example: TypeUsersGender.MAN,
  })
  @IsEnum(TypeUsersGender)
  @IsDefined()
  gender: TypeUsersGender;

  @ApiProperty({
    description: '유저 거주지 주소',
    example: [
      '서울특별시 강남구 역삼동 123-456',
      '서울특별시 강남구 역삼동 123-456',
      '서울특별시 강남구 역삼동 123-456',
    ],
  })
  @IsArray()
  @IsDefined()
  address: Array<string>;
}

export class UserAdditionalInfoDto {
  email: string;
  name: string;
  contact: string;
  gender: TypeUsersGender;

  static from(ctx: {
    email: string;
    name: string;
    contact: string;
    gender: TypeUsersGender;
  }): UserAdditionalInfoDto {
    return plainToClass(UserAdditionalInfoDto, ctx);
  }
}

export class GetUserInfoRequesst {
  @ApiProperty({
    description: '유저 id',
    example: 1,
  })
  @IsNumber()
  @IsDefined()
  @Type(() => Number)
  userId: number;
}

export class GetUserInfoResponse {
  @ApiProperty({
    description: '유저 id',
    example: 1,
  })
  id: number;
  @ApiProperty({
    description: '유저 email',
    example: 'foo@bar.com',
    required: false,
  })
  email?: string;
  @ApiProperty({
    description: '유저 이름',
    example: '홍길동',
    required: false,
  })
  name?: string;
  @ApiProperty({
    description: '유저 전화번호',
    example: '010-1234-5678',
    required: false,
  })
  contact?: string;
  @ApiProperty({
    description: '유저 경험치',
    example: 1,
  })
  experience: number;
  @ApiProperty({
    description: '유저 성별',
    example: TypeUsersGender,
  })
  gender: TypeUsersGender;
  @ApiProperty({
    description: '유저 sns',
    example: TypeUsersSns,
  })
  sns: TypeUsersSns;
  @ApiProperty({
    description: '유저 상태',
    example: TypeUsersStatus,
  })
  status: TypeUsersStatus;
  @ApiProperty({
    description: '유저 가입일',
    example: new Date(),
  })
  inputDate: Date;
  @ApiProperty({
    description: '유저 거주지 주소',
    example: ['서울특별시 강남구 역삼동 123-456'],
  })
  address: Array<string>;

  static from(data: Partial<GetUserInfoResponse>): GetUserInfoResponse {
    return plainToClass(GetUserInfoResponse, data);
  }
}

export class GetUserInfoServiceResponse {
  id: number;
  email?: string;
  name?: string;
  contact?: string;
  experience: number;
  gender: TypeUsersGender;
  sns: TypeUsersSns;
  status: TypeUsersStatus;
  inputDate: Date;
  address: Array<string>;

  static from(
    data: Partial<GetUserInfoServiceResponse>,
  ): GetUserInfoServiceResponse {
    return plainToClass(GetUserInfoServiceResponse, data);
  }
}
