import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResponseDataDto } from 'src/decorator/dto/response-data.dto';
import { ResponseData } from 'src/decorator/response-data.decorator';
import {
  PostUsersSnsLoginRequest,
  PostUsersSnsLoginResponse,
} from './dto/users.dto';
import { UsersService } from './users.service';

@ApiTags('유저')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({
    summary: '유저 SNS 로그인',
    description:
      'SNS (kakao, X, google) 등으로 로그인 및 간편 회원가입을 한다.',
  })
  @Post('sns/login')
  @ResponseData(PostUsersSnsLoginResponse)
  async postUsersSnsLoign(
    @Body() body: PostUsersSnsLoginRequest,
  ): Promise<ResponseDataDto<PostUsersSnsLoginResponse>> {
    const result = await this.usersService.oauthLogin(body.snsType, body.token);

    return new ResponseDataDto({ usersInfo: result.userInfo, jwt: result.jwt });
  }
}
