import { plainToClass } from 'class-transformer';
import {
  ActivitySoccerFormation,
  ActivitySoccerType,
} from '../enum/activity.repository.enum';
import { IActivityContent } from '../interface/activity.repository.dto.impl';

export class ActivitySoccerContent implements IActivityContent {
  categoryId: number;
  type: string | ActivitySoccerType;
  formation: string | ActivitySoccerFormation;

  static from(dto: Partial<ActivitySoccerContent>) {
    return plainToClass(ActivitySoccerContent, dto);
  }

  setType(value: ActivitySoccerType) {
    this.type = value;
  }

  setFormation(value: ActivitySoccerFormation) {
    this.formation = value;
  }
}
