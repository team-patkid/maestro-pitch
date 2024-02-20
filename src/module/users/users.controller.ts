import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { ResponseDataDto } from 'src/decorator/dto/response-data.dto';
import { ResponseData } from 'src/decorator/response-data.decorator';
import { ResponseError } from 'src/decorator/response-error.decorator';
import { ErrorCode } from 'src/exception/enum/error.enum';
import { AssociateGuard } from 'src/guard/associate.guard';
import { AuthHeader } from '../auth/enum/auth.enum';
import {
  NormalUserDto,
  PatchNormalUserRequest,
  PatchNormalUserResponse,
  PostUsersSnsLoginRequest,
  PostUsersSnsLoginResponse,
} from './dto/users.dto';
import { UsersService } from './users.service';

@ApiTags('유저')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,

    @Inject(REQUEST)
    private readonly req: Request,
  ) {}

  @ApiOperation({
    summary: '유저 SNS 로그인',
    description:
      'SNS (kakao, X, google) 등으로 로그인 및 간편 회원가입을 한다.',
  })
  @HttpCode(HttpStatus.OK)
  @Post('sns/login')
  @ResponseData(PostUsersSnsLoginResponse)
  async postUsersSnsLoign(
    @Body() body: PostUsersSnsLoginRequest,
  ): Promise<ResponseDataDto<PostUsersSnsLoginResponse>> {
    const result = await this.usersService.oauthLogin(body.snsType, body.token);

    return new ResponseDataDto({ usersInfo: result.userInfo, jwt: result.jwt });
  }

  @ApiOperation({
    summary: '유저 정회원 가입',
    description: '미인증 유저 대상으로 정회원 가입을 한다',
  })
  @Patch('normal')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AssociateGuard)
  @ApiBearerAuth(AuthHeader.BEARER)
  @ResponseData(PatchNormalUserResponse)
  @ResponseError([
    ErrorCode.ALREADY_AUTHENTICATED,
    ErrorCode.NOT_ASSOCIATE_USER,
    ErrorCode.UNAUTHORIZED,
    ErrorCode.JWT_UNABLE_VERIFY,
    ErrorCode.NOT_FOUND_CONTENT,
    ErrorCode.INTERNAL_SERVER_ERROR,
  ])
  async patchNormalMemeber(
    @Body() body: PatchNormalUserRequest,
  ): Promise<ResponseDataDto<PatchNormalUserResponse>> {
    const result = await this.usersService.patchNormalUserAndGetNormalJwt(
      this.req.userEntity.id,
      NormalUserDto.from({
        ...body,
      }),
    );

    return new ResponseDataDto({ jwt: result });
  }
}
