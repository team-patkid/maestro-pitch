import { plainToInstance } from 'class-transformer';

export class KakaoUserInfo {
  id: number;
  expires_in: number;
  app_id: number;

  static from(ctx: {
    id: number;
    expires_in: number;
    app_id: number;
  }): KakaoUserInfo {
    return plainToInstance(this, ctx);
  }

  get kakaoPk(): string {
    return this.id.toString();
  }
}

export class KakaoAuthInfo {
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
  }): KakaoAuthInfo {
    return plainToInstance(KakaoAuthInfo, ctx);
  }
}
