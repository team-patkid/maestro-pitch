import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { ActivityEntity } from 'src/repository/entity/activity.entity';
import { ActivityRepositoryService } from 'src/repository/service/activity.repository.service';
import {
  CreateActivityRequestService,
  GetActivityListServiceResponse,
} from './dto/activity.dto';

@Injectable()
export class ActivityService {
  constructor(
    private readonly activityRepositoryService: ActivityRepositoryService,
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
              name: activity.name,
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
    body: CreateActivityRequestService,
    userId: number,
  ): Promise<boolean> {
    const result = await this.activityRepositoryService.postActivity(
      plainToClass(ActivityEntity, { ...body, userId }),
    );

    return result;
  }
}
