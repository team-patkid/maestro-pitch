import { plainToClass } from 'class-transformer';
import { ActivitySoccerType } from '../enum/activity.repository.enum';
import { IActivityContent } from '../interface/activity.repository.impl';

export class ActivitySoccerContent implements IActivityContent {
  categoryId: number;
  type: string;
  formation: string;

  static from(dto: Partial<ActivitySoccerContent>) {
    return plainToClass(ActivitySoccerContent, dto);
  }

  setType(value: ActivitySoccerType) {
    this.type = value;
  }
}
