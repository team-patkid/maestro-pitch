import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResponseDataDto } from 'src/decorator/dto/response-data.dto';
import { ResponseData } from 'src/decorator/response-data.decorator';
import { AuthService } from './auth.service';
import {
  GetKakaoAUthInfoRequest,
  GetKakaoAuthInfoResponse,
} from './dto/auth.dto';

@ApiTags('인증')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    description:
      'code 값 얻는 URL : https://kauth.kakao.com/oauth/authorize?client_id=a22d2982d2b7327e97be5ed6b847b42b&response_type=code&redirect_uri=https://maestro-api.patkid.kr/health',
  })
  @Get('/kakao')
  @ResponseData(GetKakaoAuthInfoResponse)
  async getkakaoAuthInfo(
    @Query() query: GetKakaoAUthInfoRequest,
  ): Promise<ResponseDataDto<GetKakaoAuthInfoResponse>> {
    const result = await this.authService.getKakaoAuthInfo(
      query.code,
      query.redirect,
    );

    return new ResponseDataDto(
      GetKakaoAuthInfoResponse.from({
        access_token: result.access_token,
        expires_in: result.expires_in,
        refresh_token: result.refresh_token,
        refresh_token_expires_in: result.refresh_token_expires_in,
        token_type: result.token_type,
      }),
    );
  }
}
