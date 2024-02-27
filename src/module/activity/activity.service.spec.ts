import { plainToClass } from 'class-transformer';
import sinon, { SinonStubbedInstance } from 'sinon';
import { ActivityMemberSoccerContent } from 'src/repository/dto/activity.member.repository.dto';
import { ActivitySoccerContent } from 'src/repository/dto/activity.repository.dto';
import { ActivityEntity } from 'src/repository/entity/activity.entity';
import { ActivityMemberEntity } from 'src/repository/entity/activity.member.entity';
import {
  ActivityMemberSoccerHow,
  ActivityMemberSoccerPosition,
  ActivityMemberSoccerStyle,
} from 'src/repository/enum/activity.member.enum';
import {
  ActivitySoccerFormation,
  ActivitySoccerType,
  TypeActivityStatus,
} from 'src/repository/enum/activity.repository.enum';
import { IActivityContent } from 'src/repository/interface/activity.repository.dto.impl';
import { ActivityMemberRepositoryService } from 'src/repository/service/activity.member.activity.service';
import { ActivityRepositoryService } from 'src/repository/service/activity.repository.service';
import { ActivityService } from './activity.service';
import {
  CreateActivityMemberRequestService,
  CreateActivityRequestService,
  GetActivityListServiceResponse,
} from './dto/activity.dto';

describe('ActivityService', () => {
  let activityService: ActivityService;
  let activityRepositoryService: SinonStubbedInstance<ActivityRepositoryService>;
  let activityMemberRepositoryService: SinonStubbedInstance<ActivityMemberRepositoryService>;

  beforeEach(async () => {
    activityRepositoryService = sinon.createStubInstance(
      ActivityRepositoryService,
    );
    activityMemberRepositoryService = sinon.createStubInstance(
      ActivityMemberRepositoryService,
    );

    activityService = new ActivityService(
      activityRepositoryService,
      activityMemberRepositoryService,
    );
  });

  it('should be defined', () => {
    expect(activityService).toBeDefined();
  });

  const createActivityEntity = (ctx: {
    id?: number;
    userId?: number;
    categoryId?: number;
    name?: string;
    place?: string;
    placeUrl?: string;
    x?: string;
    y?: string;
    participantsMax?: number;
    content?: IActivityContent;
    status?: TypeActivityStatus;
    inputDate?: Date;
    updateDate?: Date;
  }): ActivityEntity => {
    const activity = new ActivityEntity();
    activity.id = ctx.id || 1;
    activity.userId = ctx.userId || 1;
    activity.categoryId = ctx.categoryId || 1;
    activity.name = ctx.name || 'Activity 1';
    activity.place = ctx.place || 'Seoul';
    activity.placeUrl = ctx.placeUrl || 'http://localhost:3000';
    activity.x = ctx.x || '123.456';
    activity.y = ctx.y || '123.456';
    activity.participantsMax = ctx.participantsMax || 20;
    activity.content =
      ctx.content ||
      ActivitySoccerContent.from({
        categoryId: 1,
        type: ActivitySoccerType.FULL,
        formation: ActivitySoccerFormation.FORMATION_433,
      });
    activity.status = ctx.status || TypeActivityStatus.NORMAL;
    activity.inputDate = ctx.inputDate || new Date();
    activity.updateDate = ctx.updateDate || new Date();
    activity.activityMember = [
      plainToClass(ActivityMemberEntity, {
        userId: 1,
        activityId: 1,
      }),
    ];

    return activity;
  };

  // Rest of the code...

  it('should return activity list and total count', async () => {
    const list = [1, 2, 3].map((id) => createActivityEntity({ id }));
    const total = 10;

    const categoryId = 1;

    activityRepositoryService.findAndCountAllByCategoryId.resolves([
      list,
      total,
    ]);

    // Call the method under test
    const result = await activityService.getActivityListAndTotal(categoryId);

    // Assert the result
    expect(result).toEqual([
      list.map((activity) =>
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
      total,
    ]);
  });

  it('should create an activity and return true', async () => {
    // Arrange
    const body: CreateActivityRequestService = {
      categoryId: 1,
      name: 'Activity 1',
      place: 'Seoul',
      placeUrl: 'http://localhost:3000',
      x: '123.456',
      y: '123.456',
      participantsMax: 20,
      content: ActivitySoccerContent.from({
        categoryId: 1,
        type: ActivitySoccerType.FULL,
        formation: ActivitySoccerFormation.FORMATION_433,
      }),
    };
    const userId = 1;
    const expectedActivityEntity = plainToClass(ActivityEntity, {
      ...body,
      userId,
    });
    const expectedResult = true;

    activityRepositoryService.postActivity.resolves(expectedResult);

    // Act
    const result = await activityService.createActivity(body, userId);

    // Assert
    expect(result).toBe(expectedResult);
    expect(
      activityRepositoryService.postActivity.calledOnceWithExactly(
        expectedActivityEntity,
      ),
    ).toBe(true);
  });

  it('should create an activity member and return true', async () => {
    // Arrange
    const body: CreateActivityMemberRequestService = {
      activityId: 1,
      content: ActivityMemberSoccerContent.from({
        position: ActivityMemberSoccerPosition.GK,
        backNumber: 1,
        how: ActivityMemberSoccerHow.BOTH,
        style: ActivityMemberSoccerStyle.ST,
      }),
    };
    const userId = 1;
    const expectedActivityMemberEntity = plainToClass(ActivityMemberEntity, {
      ...body,
      userId,
    });
    const expectedResult = true;

    activityMemberRepositoryService.postActivityMember.resolves(expectedResult);

    // Act
    const result = await activityService.createActivityMember(body, userId);

    // Assert
    expect(result).toBe(expectedResult);
    expect(
      activityMemberRepositoryService.postActivityMember.calledOnceWithExactly(
        expectedActivityMemberEntity,
      ),
    ).toBe(true);
  });
});
