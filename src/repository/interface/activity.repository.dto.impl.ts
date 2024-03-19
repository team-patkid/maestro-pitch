import {
  ActivitySoccerFormation,
  ActivitySoccerType,
} from '../enum/activity.repository.enum';

export interface IActivityContent {
  categoryId: number;
  type: string | ActivitySoccerType;
  formation: string | ActivitySoccerFormation;

  setType(value: string): void;
  setType(value: ActivitySoccerType): void;

  setFormation(value: string): void;
  setFormation(value: ActivitySoccerFormation): void;
}
