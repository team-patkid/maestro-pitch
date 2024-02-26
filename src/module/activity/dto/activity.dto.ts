import { ApiProperty } from '@nestjs/swagger';
import { Type, plainToClass } from 'class-transformer';
import { IsDefined, IsEnum, IsNumber, IsString } from 'class-validator';
import { ActivitySoccerContent } from 'src/repository/dto/activity.repository.dto';
import {
  ActivitySoccerFormation,
  ActivitySoccerType,
} from 'src/repository/enum/activity.repository.enum';
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
  @ApiProperty({ description: '카테고리 아이디' })
  @IsNumber()
  @IsDefined()
  @Type(() => Number)
  categoryId: number;
}

export class CreateActivityRequest {
  @ApiProperty({ description: '카테고리 아이디' })
  @IsNumber()
  @IsDefined()
  @Type(() => Number)
  categoryId: number;

  @ApiProperty({ description: '모임 이름' })
  @IsString()
  @IsDefined()
  name: string;

  @ApiProperty({ description: '모임 장소' })
  @IsString()
  @IsDefined()
  place: string;

  @ApiProperty({ description: '모임 장소 URL' })
  @IsString()
  @IsDefined()
  placeUrl: string;

  @ApiProperty({ description: 'x 좌표' })
  @IsString()
  @IsDefined()
  x: string;

  @ApiProperty({ description: 'y 좌표' })
  @IsString()
  @IsDefined()
  y: string;

  @ApiProperty({ description: '최대 참가자 수' })
  @IsNumber()
  @IsDefined()
  @Type(() => Number)
  participantsMax: number;

  @ApiProperty({
    description: '스포츠 타입',
  })
  @IsEnum(ActivitySoccerType)
  @IsDefined()
  type: ActivitySoccerType;

  @ApiProperty({
    description: '스포츠 포메이션',
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
