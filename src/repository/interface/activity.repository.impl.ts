import { ActivitySoccerType } from '../enum/activity.repository.enum';

export interface IActivityContent {
  categoryId: number;
  type: string;
  formation: string;

  setType(value: string): void;
  setType(value: ActivitySoccerType): void;
}
