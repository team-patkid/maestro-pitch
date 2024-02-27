import { plainToClass } from 'class-transformer';
import {
  ActivityMemberSoccerHow,
  ActivityMemberSoccerPosition,
  ActivityMemberSoccerStyle,
} from '../enum/activity.member.enum';
import { IActivityMemberContent } from '../interface/activity.member.repository.dto.impl';

export class ActivityMemberSoccerContent implements IActivityMemberContent {
  position: string | ActivityMemberSoccerPosition;
  backNumber: number;
  how: string | ActivityMemberSoccerHow;
  style: string | ActivityMemberSoccerStyle;

  static from(dto: Partial<ActivityMemberSoccerContent>) {
    return plainToClass(ActivityMemberSoccerContent, dto);
  }

  setPosition(value: string | ActivityMemberSoccerPosition) {
    this.position = value;
  }

  setBackNumber(value: number) {
    this.backNumber = value;
  }

  setHow(value: string | ActivityMemberSoccerHow) {
    this.how = value;
  }

  setStyle(value: string | ActivityMemberSoccerStyle) {
    this.style = value;
  }
}
