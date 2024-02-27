import { ApiProperty } from '@nestjs/swagger';
import { Type, plainToClass } from 'class-transformer';
import {
  IsDefined,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ActivitySoccerContent } from 'src/repository/dto/activity.repository.dto';
import {
  ActivityMemberSoccerHow,
  ActivityMemberSoccerPosition,
  ActivityMemberSoccerStyle,
  TypeActivityMemberStatus,
  TypeActivityMemberType,
} from 'src/repository/enum/activity.member.enum';
import {
  ActivitySoccerFormation,
  ActivitySoccerType,
} from 'src/repository/enum/activity.repository.enum';
import { IActivityMemberContent } from 'src/repository/interface/activity.member.repository.dto.impl';
import { IActivityContent } from 'src/repository/interface/activity.repository.dto.impl';

export class GetActivityListServiceResponse {
  id: number;
  makerId: number;
  categoryId: number;
  name: string;
  participants: number;
  participantsMax: number;
  content: IActivityContent;
  inputData: Date;

  static from(
    data: Partial<GetActivityListServiceResponse>,
  ): GetActivityListServiceResponse {
    return plainToClass(GetActivityListServiceResponse, data);
  }
}

export class GetActivityListResponse {
  id: number;
  makerId: number;
  categoryId: number;
  name: string;
  participants: number;
  participantsMax: number;
  content: ActivitySoccerContent;
  inputData: Date;

  static from(data: Partial<GetActivityListResponse>): GetActivityListResponse {
    return plainToClass(GetActivityListResponse, data);
  }
}

export class GetActivityListRequest {
  @ApiProperty({ description: '카테고리 아이디', example: 1 })
  @IsNumber()
  @IsDefined()
  @Type(() => Number)
  categoryId: number;
}

export class CreateActivityRequest {
  @ApiProperty({ description: '카테고리 아이디', example: 1 })
  @IsNumber()
  @IsDefined()
  @Type(() => Number)
  categoryId: number;

  @ApiProperty({ description: '모임 이름', example: '축구모임' })
  @IsString()
  @IsDefined()
  name: string;

  @ApiProperty({ description: '모임 장소', example: '서울시 강남구' })
  @IsString()
  @IsDefined()
  place: string;

  @ApiProperty({
    description: '모임 장소 URL',
    example: 'https://map.naver.com/',
  })
  @IsString()
  @IsDefined()
  placeUrl: string;

  @ApiProperty({ description: 'x 좌표', example: '37.123456' })
  @IsString()
  @IsDefined()
  x: string;

  @ApiProperty({ description: 'y 좌표', example: '127.123456' })
  @IsString()
  @IsDefined()
  y: string;

  @ApiProperty({ description: '최대 참가자 수', example: 10 })
  @IsNumber()
  @IsDefined()
  @Type(() => Number)
  participantsMax: number;

  @ApiProperty({
    description: '스포츠 타입',
    example: 'full',
  })
  @IsEnum(ActivitySoccerType)
  @IsDefined()
  type: ActivitySoccerType;

  @ApiProperty({
    description: '스포츠 포메이션',
    example: '442',
  })
  @IsEnum(ActivitySoccerFormation)
  @IsDefined()
  formation: ActivitySoccerFormation;
}

export class CreateActivityRequestService {
  categoryId: number;
  name: string;
  place: string;
  placeUrl: string;
  x: string;
  y: string;
  participantsMax: number;
  content: IActivityContent;

  static from(
    data: Partial<CreateActivityRequestService>,
  ): CreateActivityRequestService {
    return plainToClass(CreateActivityRequestService, data);
  }
}

export class CreateActivityMemberRequest {
  @ApiProperty({ description: '활동 아이디', example: 1 })
  @IsNumber()
  @IsDefined()
  @Type(() => Number)
  activityId: number;

  @ApiProperty({ description: '유저 포지션', example: 'GK' })
  @IsEnum(ActivityMemberSoccerPosition)
  @IsDefined()
  position: ActivityMemberSoccerPosition;

  @ApiProperty({ description: '유저 백넘버', example: 1 })
  @IsNumber()
  @IsDefined()
  @Type(() => Number)
  backNumber: number;

  @ApiProperty({ description: '유저 플레이 방법', example: 'left' })
  @IsEnum(ActivityMemberSoccerHow)
  @IsDefined()
  how: ActivityMemberSoccerHow;

  @ApiProperty({ description: '유저 스타일', example: 'ST' })
  @IsEnum(ActivityMemberSoccerStyle)
  @IsDefined()
  style: ActivityMemberSoccerStyle;

  @ApiProperty({
    description:
      '활동 유저 타입 (활동 만든 사람 = admin, 일반 참가 유저 = normal, 공유 유저 = share) default = normal',
    example: 'normal',
  })
  @IsEnum(TypeActivityMemberType)
  @IsOptional()
  type?: TypeActivityMemberType;

  @ApiProperty({
    description:
      '활동 유저 상태 (대기 = wait, 정상 = normal, 완료 = done, 삭제 = delete) default = wait',
    example: 'wait',
  })
  @IsEnum(TypeActivityMemberStatus)
  @IsOptional()
  status?: TypeActivityMemberStatus;
}

export class CreateActivityMemberRequestService {
  activityId: number;
  content: IActivityMemberContent;
  type?: TypeActivityMemberType;
  status?: TypeActivityMemberStatus;

  static from(
    data: Partial<CreateActivityMemberRequestService>,
  ): CreateActivityMemberRequestService {
    return plainToClass(CreateActivityMemberRequestService, data);
  }
}
