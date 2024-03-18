import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { ActivityEntity } from 'src/repository/entity/activity.entity';
import { ActivityMemberEntity } from 'src/repository/entity/activity.member.entity';
import { ActivityMemberRepositoryService } from 'src/repository/service/activity.member.activity.service';
import { ActivityRepositoryService } from 'src/repository/service/activity.repository.service';
import {
  CreateActivityMemberRequestService,
  CreateActivityRequestService,
  GetActivityListServiceResponse,
} from './dto/activity.dto';

@Injectable()
export class ActivityService {
  constructor(
    private readonly activityRepositoryService: ActivityRepositoryService,
    private readonly activityMemberRepositoryService: ActivityMemberRepositoryService,
  ) {}

  async getActivityListAndTotal(
    categoryId: number,
  ): Promise<[Array<GetActivityListServiceResponse>, number]> {
    const list =
      await this.activityRepositoryService.findAndCountAllByCategoryId(
        categoryId,
      );

    return [
      list[0].length === 0
        ? []
        : list[0].map((activity) =>
            GetActivityListServiceResponse.from({
              id: activity.id,
              makerId: activity.userId,
              categoryId: activity.categoryId,
              title: activity.title,
              participants: activity.activityMember.length,
              participantsMax: activity.participantsMax,
              content: activity.content,
              inputData: activity.inputDate,
            }),
          ),
      list[1],
    ];
  }

  async createActivity(
    ctx: CreateActivityRequestService,
    userId: number,
  ): Promise<boolean> {
    const result = await this.activityRepositoryService.postActivity(
      plainToClass(ActivityEntity, { ...ctx, userId }),
    );

    return result;
  }

  async createActivityMember(
    ctx: CreateActivityMemberRequestService,
    userId: number,
  ): Promise<boolean> {
    const result =
      await this.activityMemberRepositoryService.postActivityMember(
        plainToClass(ActivityMemberEntity, { ...ctx, userId }),
      );
    return result;
  }
}
