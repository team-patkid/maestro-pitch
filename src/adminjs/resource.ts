import { ActivityEntity } from 'src/repository/entity/activity.entity';
import { ActivityMemberEntity } from 'src/repository/entity/activity.member.entity';
import { AddressEntity } from 'src/repository/entity/address.entity';
import { CategoryEntity } from 'src/repository/entity/category.entity';
import { LogExperienceEntity } from 'src/repository/entity/log-experience.entity';
import { UsersEntity } from 'src/repository/entity/users.entity';
import {
  ActivityMemberSoccerHow,
  ActivityMemberSoccerPosition,
  ActivityMemberSoccerStyle,
} from 'src/repository/enum/activity.member.enum';
import {
  ActivitySoccerFormation,
  ActivitySoccerType,
} from 'src/repository/enum/activity.repository.enum';

export const usersResource = {
  resource: UsersEntity,
  options: {
    properties: {
      password: {
        isVisible: false,
      },
      id: {
        isTitle: true,
      },
    },
    parent: {
      name: '유저',
    },
  },
};

export const activityResource = {
  resource: ActivityEntity,
  options: {
    properties: {
      content: {
        type: 'mixed',
        description: '각 활동에 필요한 정보 (축구, 야구, 탁구 등)',
      },
      'content.categoryId': {
        type: 'number',
      },
      'content.type': {
        availableValues: Object.values(ActivitySoccerType).map((v) => ({
          value: v,
          label: v,
        })),
        description: '모임 경기 타입 (풋살, 하프, 탁구 복식 등)',
      },
      'content.formation': {
        availableValues: Object.values(ActivitySoccerFormation).map((v) => ({
          value: v,
          label: v,
        })),
        description: '모임 경기 포메이션 (4-3-3, 4-4-2, 2:2, 야구 6명 등)',
      },
    },
    parent: {
      name: '모임',
    },
  },
};

export const activityMemberResource = {
  resource: ActivityMemberEntity,
  options: {
    properties: {
      id: {
        isTitle: true,
      },
      content: {
        type: 'mixed',
        description: '각 활동에 필요한 유저 정보 (축구, 야구, 탁구, 등)',
      },
      'content.position': {
        availableValues: Object.values(ActivityMemberSoccerPosition).map(
          (v) => ({ value: v, label: v }),
        ),
        description: '원하는 포지션',
      },
      'content.backNumber': {
        type: 'number',
        decription: '원하는 등 번호',
      },
      'content.how': {
        availableValues: Object.values(ActivityMemberSoccerHow).map((v) => ({
          value: v,
          label: v,
        })),
        description: '무슨 잡이 인지 (왼발 잡이, 오른손 투수 등)',
      },
      'content.style': {
        availableValues: Object.values(ActivityMemberSoccerStyle).map((v) => ({
          value: v,
          label: v,
        })),
        description: '어떤 스타일인지 (공격수, 수비수 등)',
      },
    },
    parent: {
      name: '모임 참가자',
    },
  },
};

export const addressResource = {
  resource: AddressEntity,
  options: {
    parent: {
      name: '유저 주소',
    },
  },
};

export const categoryResource = {
  resource: CategoryEntity,
  options: {
    parent: {
      name: '카테고리',
    },
  },
};

export const logExperienceResource = {
  resource: LogExperienceEntity,
  options: {
    parent: {
      name: '경험치 로그',
    },
  },
};
