export interface Configuration {
  readonly ENV: string;
  readonly PORT: number;
  readonly API_VERSION: string;
  readonly SENTRY_DSN: string;
  // DB
  readonly DB_INFO: {
    host: string;
    port: number;
    max: number;
    database: string;
    user: string;
    password: string;
  };

  // 소셜 로그인
  readonly SNS: {
    KAKAO: {
      API: string;
      AUTH_HOST: string;
      API_HOST: string;
      SECRET: string;
      RESPONSE_TYPE: string;
      GRANT_TYPE: string;
    };
  };

  readonly JWT: {
    SECRET: string;
    LOGIN_EXPIRE_IN: string;
  };

  // Admin
  readonly ADMIN: {
    ID: string;
    PASSWORD: string;
  };
}
