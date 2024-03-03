import { ApiProperty } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { IsDefined, IsString, IsUrl } from 'class-validator';

export class GetKakaoAUthInfoRequest {
  @ApiProperty({
    example:
      'N6kmZd-APXjHUmxKnN4ljrMaTEdARaBq5U9anMUcrNfgwLx_aLfukvJBju4KKiVRAAABjRV-SVsh5oEAb4_jFQ',
    description: 'kakao 로그인 후 callback 데이터중 code 값',
  })
  @IsString()
  @IsDefined()
  code: string;

  @ApiProperty({
    example: 'https://maestro-api.patkid.kr/health',
    description: 'kakao 로그인 후 callback 데이터를 보낸 주소',
  })
  @IsString()
  @IsDefined()
  redirect: string;
}

export class GetKakaoAuthInfoResponse {
  access_token: string;
  token_type: string;
  refresh_token: string;
  expires_in: number;
  refresh_token_expires_in: number;

  static from(ctx: {
    access_token: string;
    token_type: string;
    refresh_token: string;
    expires_in: number;
    refresh_token_expires_in: number;
  }): GetKakaoAuthInfoResponse {
    return plainToInstance(GetKakaoAuthInfoResponse, ctx);
  }
}
