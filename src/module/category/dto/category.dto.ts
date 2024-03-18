import { ApiProperty } from '@nestjs/swagger';

export class CategoryListServiceResponse {
  @ApiProperty({
    example: 1,
    description: '카테고리 아이디',
  })
  id: number;
  @ApiProperty({
    example: '야구',
    description: '카테고리 이름',
  })
  title: string;
  @ApiProperty({
    example:
      '야구는 9명의 타자와 9명의 수비수로 이루어진 경기로, 타자는 공을 치고, 수비수는 공을 잡아야 한다. 야구는 9회까지 진행되며, 점수가 높은 팀이 승리한다.',
    description: '카테고리 설명',
  })
  description: string;
  @ApiProperty({
    example: 'https://www.youtube.com/watch?v=1234',
    description: '카테고리 영상',
  })
  video: string;
  @ApiProperty({
    example: 'https://www.naver.com/1234',
    description: '카테고리 이미지',
  })
  image: string;
  @ApiProperty({
    example: true,
    description: '카테고리의 인기 여부',
  })
  isHot: boolean;
  @ApiProperty({
    example: 'https://www.naver.com/1234',
    description: '카테고리 로고',
  })
  logo: string;
}
