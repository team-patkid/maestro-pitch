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
