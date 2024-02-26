import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResponseListDto } from 'src/decorator/dto/response.list.dto';
import { ResponseList } from 'src/decorator/response-list.decorator';
import { ActivityService } from './activity.service';
import {
  GetActivityListRequest,
  GetActivityListResponse,
} from './dto/activity.dto';

@Controller('activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @ApiTags('게시글')
  @ApiOperation({
    summary: 'Get activity list',
    description: 'Get activity list',
  })
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
        name: activity.name,
        participants: activity.participants,
        participantsMax: activity.participantsMax,
        content: activity.content,
        inputData: activity.inputData,
      }),
    );

    const total = list[1];

    return new ResponseListDto(responseList, total);
  }
}
