import { Inject, Injectable } from '@nestjs/common';
import { KakaoClientService } from '../client/kakao.client.service';
import { KakaoAuthInfo } from '../client/dto/kakao.client.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'jsonwebtoken';
import { ServiceError } from 'src/exception/service.error';
import { ErrorCode } from 'src/exception/enum/error.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly kakaoClientService: KakaoClientService,
    private readonly jwtService: JwtService,
  ) {}

  async getKakaoAuthInfo(
    code: string,
    redirect: string,
  ): Promise<KakaoAuthInfo> {
    const kakaoAuthInfo = await this.kakaoClientService.getKakaoAuthInfo(
      code,
      redirect,
    );

    return kakaoAuthInfo;
  }

  async getJwt(payload: JwtPayload, expiresIn: string): Promise<string> {
    const jwt = await this.jwtService.signAsync(payload, { expiresIn });

    return jwt;
  }

  async decodeJwt<T>(jwt: string): Promise<T> {
    try {
      await this.jwtService.verifyAsync(jwt);
    } catch (error) {
      throw new ServiceError(ErrorCode.JWT_UNABLE_VERIFY, error);
    }

    const payload = this.jwtService.decode<T>(jwt);

    return payload;
  }
}
