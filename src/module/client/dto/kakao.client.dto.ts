import { plainToInstance } from 'class-transformer';

export class KakaoUserInfo {
  id: number;
  expires_in: number;
  app_id: number;

  static from(id: number, expires_in: number, app_id: number): KakaoUserInfo {
    return plainToInstance(this, {
      id,
      expires_in,
      app_id,
    });
  }
}
