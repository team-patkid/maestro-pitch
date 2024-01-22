import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'jsonwebtoken';
import { ErrorCode } from 'src/exception/enum/error.enum';
import { ServiceError } from 'src/exception/service.error';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

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
