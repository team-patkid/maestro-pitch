import { Injectable } from '@nestjs/common';
import { ActivityRepositoryService } from 'src/repository/service/activity.repository.service';
import { GetActivityListServiceResponse } from './dto/activity.dto';

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
}
