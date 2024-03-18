import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { ResponseDataDto } from 'src/decorator/dto/response-data.dto';
import { ResponseListDto } from 'src/decorator/dto/response.list.dto';
import { ResponseData } from 'src/decorator/response-data.decorator';
import { ResponseList } from 'src/decorator/response-list.decorator';
import { NormalGuard } from 'src/guard/normal.guard';
import { ActivityMemberSoccerContent } from 'src/repository/dto/activity.member.repository.dto';
import { IActivityContent } from 'src/repository/interface/activity.repository.dto.impl';
import { AuthHeader } from '../auth/enum/auth.enum';
import { ActivityService } from './activity.service';
import {
  CreateActivityMemberRequest,
  CreateActivityMemberRequestService,
  CreateActivityRequest,
  CreateActivityRequestService,
  GetActivityListRequest,
  GetActivityListResponse,
} from './dto/activity.dto';

@Controller('activity')
export class ActivityController {
  constructor(
    @Inject(REQUEST)
    private readonly req: Request,

    private readonly activityService: ActivityService,
  ) {}

  @ApiTags('모임')
  @ApiOperation({
    summary: '모임 리스트 조회',
    description: '유저들이 생성한 모임 리스트 조회',
  })
  @HttpCode(HttpStatus.OK)
  @Get('list/:categoryId')
  @ResponseList(GetActivityListResponse)
  async getActivityList(
    @Param() param: GetActivityListRequest,
  ): Promise<ResponseListDto<GetActivityListResponse>> {
    const list = await this.activityService.getActivityListAndTotal(
      param.categoryId,
    );

    const responseList = list[0].map((activity) =>
      GetActivityListResponse.from({
        id: activity.id,
        makerId: activity.makerId,
        categoryId: activity.categoryId,
        title: activity.title,
        participants: activity.participants,
        participantsMax: activity.participantsMax,
        content: activity.content,
        inputData: activity.inputData,
      }),
    );

    const total = list[1];

    return new ResponseListDto(responseList, total);
  }

  @ApiTags('모임')
  @ApiOperation({
    summary: '모임 글 쓰기',
    description: '축구 야구 등 스포츠 모임 글 쓰기',
  })
  @UseGuards(NormalGuard)
  @ApiBearerAuth(AuthHeader.BEARER)
  @HttpCode(HttpStatus.OK)
  @ResponseData(Boolean)
  @Post()
  async createActivity(
    @Body() body: CreateActivityRequest,
  ): Promise<ResponseDataDto<boolean>> {
    const result = await this.activityService.createActivity(
      CreateActivityRequestService.from({
        categoryId: body.categoryId,
        name: body.name,
        place: body.place,
        placeUrl: body.placeUrl,
        x: body.x,
        y: body.y,
        participantsMax: body.participantsMax,
        content: {
          categoryId: body.categoryId,
          type: body.type,
          formation: body.formation,
        } as IActivityContent,
      }),
      this.req.userEntity.id,
    );

    return new ResponseDataDto(result);
  }

  @ApiTags('모임')
  @ApiOperation({
    summary: '모임 참가 신청',
    description: '모임 참가 신청',
  })
  @UseGuards(NormalGuard)
  @ApiBearerAuth(AuthHeader.BEARER)
  @HttpCode(HttpStatus.OK)
  @ResponseData(Boolean)
  @Post('member')
  async createActivityMember(
    @Body() body: CreateActivityMemberRequest,
  ): Promise<ResponseDataDto<boolean>> {
    const result = await this.activityService.createActivityMember(
      CreateActivityMemberRequestService.from({
        activityId: body.activityId,
        content: ActivityMemberSoccerContent.from({
          position: body.position,
          backNumber: body.backNumber,
          how: body.how,
          style: body.style,
        }),
        type: body.type,
        status: body.status,
      }),
      this.req.userEntity.id,
    );

    return new ResponseDataDto(result);
  }
}
