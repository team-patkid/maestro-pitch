import { ApiProperty } from '@nestjs/swagger';
import { Type, plainToClass } from 'class-transformer';
import { IsDefined, IsNumber } from 'class-validator';
import { ActivitySoccerContent } from 'src/repository/dto/activity.repository.dto';
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
