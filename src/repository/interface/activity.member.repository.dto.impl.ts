import {
  ActivityMemberSoccerHow,
  ActivityMemberSoccerPosition,
  ActivityMemberSoccerStyle,
} from '../enum/activity.member.enum';

export interface IActivityMemberContent {
  position: string | ActivityMemberSoccerPosition;
  backNumber: number;
  how: string | ActivityMemberSoccerHow;
  style: string | ActivityMemberSoccerStyle;

  setPosition(value: string): void;
  setPosition(value: ActivityMemberSoccerPosition): void;

  setHow(value: string): void;
  setHow(value: ActivityMemberSoccerHow): void;

  setStyle(value: string): void;
  setStyle(value: ActivityMemberSoccerStyle): void;
}
